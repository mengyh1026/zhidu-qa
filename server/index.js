/**
 * 境外财务管理操作指南 · 问答代理
 * 职责：接收前端问题 + 检索片段 → 调用 DeepSeek 生成回答
 * 兼容：阿里云函数计算(FC) / 腾讯云云函数(SCF) / 本地 Node 服务
 *
 * 环境变量：
 *   DEEPSEEK_API_KEY  必填，DeepSeek 开放平台 API Key
 *   DEEPSEEK_BASE     可选，默认 https://api.deepseek.com
 *   DEEPSEEK_MODEL    可选，默认 deepseek-chat
 *   PORT              可选，本地运行时端口，默认 9000
 */
"use strict";

const http = require("http");
const https = require("https");

const API_KEY = process.env.DEEPSEEK_API_KEY || "";
const BASE = process.env.DEEPSEEK_BASE || "https://api.deepseek.com";
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

const SYSTEM_PROMPT =
  "你是中国海诚工程科技股份有限公司的境外财务管理智能助手，基于《中国海诚境外财务管理操作指南》（阿联酋、摩洛哥）回答财务相关问题。\n" +
  "回答规则：\n" +
  "1. 优先依据用户提供的制度条文回答，回答时注明国别和章节出处；\n" +
  "2. 若条文不足以回答，明确说明信息不足，绝不编造税率、期限、材料等关键信息；\n" +
  "3. 回答专业、简洁、条理清晰，适合财务人员快速阅读，可适当使用列表；\n" +
  "4. 涉及具体数字（税率、金额、期限）时务必与条文一致；\n" +
  "5. 文中出现的每个关键数字、期限、材料清单后加角标注来源，如「9%」写作「9%[阿联酋 · 4.2.1]」；
" +
  "6. 若检索内容不足以回答，直接说明「指南未覆盖此问题，建议咨询总部财金中心」，不用已检索内容外的知识编造；
" +
  "7. 回答正文开头先用一行「【要点】...」给出一句话结论（如税率/截止日/材料核心结论），再展开详细说明；
" +
  "8. 回答正文结束后，另起一行以「相关提问：」开头，给出2-3个简洁的追问建议（用顿号分隔），帮助用户连续查询；若无延伸可省略。";

function callDeepSeek(messages) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 2000,
      stream: false,
    });
    const url = new URL(BASE + "/chat/completions");
    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            const j = JSON.parse(data);
            if (j.error) {
              reject(new Error((j.error.message || "DeepSeek 接口错误") + " (code=" + (j.error.code || "?") + ")"));
            } else if (j.choices && j.choices[0] && j.choices[0].message) {
              resolve(j.choices[0].message.content);
            } else {
              reject(new Error("DeepSeek 响应格式异常: " + data.slice(0, 200)));
            }
          } catch (e) {
            reject(new Error("解析 DeepSeek 响应失败: " + data.slice(0, 200)));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function handleChat(question, context, history) {
  if (!API_KEY) {
    throw new Error("服务端未配置 DEEPSEEK_API_KEY，请检查环境变量");
  }
  const ctxText = (context || [])
    .map((c) => `【${c.section}】\n${c.text}`)
    .join("\n\n---\n\n");
  const histMsgs = [];
  for (const h of (history || []).slice(-3)) {
    if (h && h.q) histMsgs.push({ role: "user", content: String(h.q).slice(0, 500) });
    if (h && h.a) histMsgs.push({ role: "assistant", content: String(h.a).slice(0, 1500) });
  }
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...histMsgs,
    {
      role: "user",
      content:
        "以下是检索到的相关制度条文（按相关性排序）：\n\n" +
        ctxText +
        "\n\n请基于以上条文回答下面的问题：\n" +
        question,
    },
  ];
  return await callDeepSeek(messages);
}

function parseBody(event) {
  // 兼容不同平台的事件格式
  if (typeof event === "string") {
    try { return JSON.parse(event); } catch (e) { return; }
  }
  if (event && typeof event.body === "string") {
    try { return JSON.parse(event.body); } catch (e) { return; }
  }
  return event || {};
}

function okResponse(data) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify(data),
    isBase64Encoded: false,
  };
}

function errResponse(message) {
  return {
    statusCode: 500,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ error: message }),
    isBase64Encoded: false,
  };
}

// ============ 阿里云函数计算 FC 入口 ============
exports.handler = (event, context, callback) => {
  const body = parseBody(event);
  handleChat(body.question, body.context, body.history)
    .then((answer) => callback(null, okResponse({ answer })))
    .catch((e) => callback(null, errResponse(e.message)));
};

// ============ 腾讯云云函数 SCF 入口 ============
exports.main_handler = async (event, context) => {
  const body = parseBody(event);
  try {
    const answer = await handleChat(body.question, body.context, body.history);
    return okResponse({ answer });
  } catch (e) {
    return errResponse(e.message);
  }
};

// ============ 本地运行：node index.js ============
if (require.main === module) {
  const PORT = process.env.PORT || 9000;
  const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }
    if (req.method !== "POST" || req.url !== "/chat") {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
      return;
    }
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", async () => {
      try {
        const body = JSON.parse(raw);
        const answer = await handleChat(body.question, body.context, body.history);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ answer }));
      } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  });
  server.listen(PORT, () => console.log("QA proxy listening on http://localhost:" + PORT));
}
