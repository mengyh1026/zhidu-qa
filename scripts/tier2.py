# -*- coding: utf-8 -*-
# 2026-08-28 第二梯队：多轮追问(history) + 来源溯源(条文展开) + 相关问题推荐(followups)
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ============ A. 云函数（deploy/scf/index.js 与 server/index.js 同步） ============
CF_PATHS = [os.path.join(BASE, "deploy", "scf", "index.js"),
            os.path.join(BASE, "server", "index.js")]

cf_old_prompt = '''  "4. 涉及具体数字（税率、金额、期限）时务必与条文一致。";'''
cf_new_prompt = '''  "4. 涉及具体数字（税率、金额、期限）时务必与条文一致；\\n" +
  "5. 回答正文结束后，另起一行以「相关提问：」开头，给出2-3个简洁的追问建议（用顿号分隔），帮助用户连续查询；若无延伸可省略。";'''

cf_old_fn = "async function handleChat(question, context) {"
cf_new_fn = "async function handleChat(question, context, history) {"

cf_old_msg = '''  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    {'''
cf_new_msg = '''  const histMsgs = [];
  for (const h of (history || []).slice(-3)) {
    if (h && h.q) histMsgs.push({ role: "user", content: String(h.q).slice(0, 500) });
    if (h && h.a) histMsgs.push({ role: "assistant", content: String(h.a).slice(0, 1500) });
  }
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...histMsgs,
    {'''

cf_old_call = "handleChat(body.question, body.context)"
cf_new_call = "handleChat(body.question, body.context, body.history)"

for p in CF_PATHS:
    s = open(p, encoding="utf-8").read()
    misses = []
    for a, b, cnt in [(cf_old_prompt, cf_new_prompt, 1), (cf_old_fn, cf_new_fn, 1),
                      (cf_old_msg, cf_new_msg, 1), (cf_old_call, cf_new_call, 3)]:
        if s.count(a) == cnt:
            s = s.replace(a, b)
        else:
            misses.append((a[:40], s.count(a)))
    open(p, "w", encoding="utf-8").write(s)
    print(os.path.relpath(p, BASE), "misses:", misses or "none")

# ============ B. 前端 ============
APP = os.path.join(BASE, "app", "index.html")
html = open(APP, encoding="utf-8").read()
missed = []

def rep(a, b):
    global html
    if a in html:
        html = html.replace(a, b, 1)
    else:
        missed.append(a[:50])

# B1. CSS：条文展开 + 追问区
rep("""  .toolbtn.copied { color: #2e8b57; }""",
    """  .toolbtn.copied { color: #2e8b57; }
  .src-detail {
    background: #f8fafc;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 10px;
    margin-top: 6px;
    font-size: 13px;
    color: #374151;
    white-space: pre-wrap;
    max-height: 220px;
    overflow-y: auto;
  }
  .taglink { cursor: pointer; }
  .taglink:hover { text-decoration: underline; }
  .followups { margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--border); }
  .fu-label { font-size: 12px; color: var(--text-sub); margin-bottom: 6px; }
  .fuchip { display: inline-block; margin: 0 6px 6px 0; font-size: 13px; padding: 5px 12px; }""")

# B2. JS：HISTORY 定义
rep("""// ============ 检索（BM25） ============""",
    """// ============ 对话历史（供多轮追问） ============
let HISTORY = []; // {q, a}

// ============ 检索（BM25） ============""")

# B3. 请求体带 history
rep("""        body: JSON.stringify({ question: q, context }),""",
    """        body: JSON.stringify({ question: q, context, history: HISTORY.slice(-3) }),""")

# B4. sourceHtml 可溯源（点击展开条文）
rep("""function sourceHtml(results) {
  if (!results || results.length === 0) return "";
  const tags = results.map(r => `<span class="tag">${r.c} · ${r.s}</span>`).join("");
  return `<div class="source">📎 参考来源：${tags}</div>`;
}""",
    """const SRC_STORE = [];
function sourceHtml(results) {
  if (!results || results.length === 0) return "";
  const start = SRC_STORE.length;
  results.forEach(r => SRC_STORE.push(r));
  const tags = results.map((r, i) =>
    `<span class="tag taglink" data-si="${start + i}" title="点击查看条文原文">${r.c} · ${r.s} ▾</span>`).join("");
  return `<div class="source">📎 参考来源（点击标签查看原文）：${tags}<div class="src-detail" style="display:none"></div></div>`;
}
document.addEventListener("click", e => {
  const tag = e.target.closest(".taglink");
  if (!tag) return;
  const detail = tag.closest(".source").querySelector(".src-detail");
  if (!detail) return;
  if (detail.style.display !== "none" && detail.dataset.si === tag.dataset.si) {
    detail.style.display = "none"; return;
  }
  const r = SRC_STORE[Number(tag.dataset.si)];
  if (!r) return;
  detail.dataset.si = tag.dataset.si;
  const txt = r.t.length > 600 ? r.t.slice(0, 600) + "…" : r.t;
  detail.innerHTML = "<b>条文原文（截取）：</b>\\n" + escapeHtml(txt);
  detail.style.display = "block";
});

// ============ 追问建议 ============
function splitFollowups(answer) {
  const m = answer.match(/(?:【相关提问】|相关提问)[:：]\\s*([\\s\\S]+)$/m);
  if (!m) return { body: answer, followups: [] };
  const body = answer.slice(0, m.index).trim();
  const followups = m[1].split(/[、;；\\n]/)
    .map(s => s.replace(/^[\\s"'“”\\d.、-]+|[\\s"'“”]+$/g, ""))
    .filter(s => s.length >= 5 && s.length <= 40).slice(0, 3);
  return { body, followups };
}
function addFollowups(div, followups) {
  const box = document.createElement("div");
  box.className = "followups";
  const label = document.createElement("div");
  label.className = "fu-label";
  label.textContent = "💡 你可能还想问：";
  box.appendChild(label);
  followups.forEach(fq => {
    const c = document.createElement("span");
    c.className = "chip fuchip";
    c.textContent = fq;
    c.addEventListener("click", () => ask(fq));
    box.appendChild(c);
  });
  div.querySelector(".bubble").appendChild(box);
}""")

# B5. ask() 成功后：拆追问、挂载、记录历史
rep("""  removeTyping();
  if (answer) {
    const div = addMsg("bot", renderMarkdown(answer) + sourceHtml(results));
    addTools(div, () => answer);
  } else {""",
    """  removeTyping();
  if (answer) {
    const parsed = splitFollowups(answer);
    const div = addMsg("bot", renderMarkdown(parsed.body) + sourceHtml(results));
    addTools(div, () => parsed.body);
    if (parsed.followups.length) addFollowups(div, parsed.followups);
    HISTORY.push({ q, a: answer });
    if (HISTORY.length > 6) HISTORY = HISTORY.slice(-6);
  } else {""")

# B6. 清空对话同时清历史
rep("""  chatEl.innerHTML = "";
  welcomeEl.style.display = "";""",
    """  chatEl.innerHTML = "";
  HISTORY = [];
  welcomeEl.style.display = "";""")

open(APP, "w", encoding="utf-8").write(html)
print("front missed:", missed if missed else "none")
