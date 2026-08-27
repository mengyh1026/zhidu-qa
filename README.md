# 境外财务管理操作指南 · 智能问答助手

基于《中国海诚境外财务管理操作指南》（阿联酋、摩洛哥）的智能问答网页应用。

## 架构

```
┌─────────────┐   POST /chat    ┌──────────────────┐   HTTPS    ┌────────────┐
│  前端页面    │ ──────────────▶ │  Serverless 代理  │ ─────────▶ │  DeepSeek  │
│ (App Studio)│  {question,     │  (key 在环境变量) │  chat API  │  (大模型)  │
│  内置检索索引 │   context}      │                  │            │            │
└─────────────┘ ◀────────────── └──────────────────┘ ◀───────── └────────────┘
      │ 回答 + 来源出处
```

- **前端**：`app/` 目录，单页应用，内置 86 条制度条文索引（`data.js`），本地 BM25 检索。
- **代理**：`server/index.js`，Node.js，兼容阿里云 FC / 腾讯云 SCF / 本地运行。
- **数据**：`data/chunks.json` 为制度条文切分结果，`scripts/` 为生成脚本。

## 一、部署后端代理（任选其一）

### 方式 A：阿里云函数计算 FC（推荐）

1. 注册/登录阿里云，开通「函数计算 FC」；
2. 创建函数：运行时选 **Node.js 18**，处理程序填 `index.handler`；
3. 上传 `server/index.js` 为 `index.js`；
4. 配置环境变量：`DEEPSEEK_API_KEY` = 你的 DeepSeek Key；
5. 创建 HTTP 触发器，得到访问地址（形如 `https://xxx.fc.aliyuncs.com/chat`）；
6. 在函数「触发器」配置中确认请求方法含 **POST**。

### 方式 B：腾讯云云函数 SCF

1. 创建云函数，运行时选 **Node.js 16+**，入口函数填 `main_handler`；
2. 上传 `server/index.js`；
3. 配置环境变量 `DEEPSEEK_API_KEY`；
4. 创建 API 网关触发器（POST），得到访问地址。

### 方式 C：本地/自有服务器

```bash
export DEEPSEEK_API_KEY=sk-xxxx
node server/index.js        # 监听 9000 端口
```

## 二、配置前端

编辑 `app/index.html` 顶部：

```js
const PROXY_URL = "https://你的代理地址/chat";
```

> 留空时前端自动降级为「检索模式」：直接展示命中的制度条文原文，不调用大模型。

## 三、部署前端到 WPS App Studio

1. 用 comate-cli 创建项目并发布 `app/` 目录；
2. 发布后设置可见范围（公司内可见 / 指定成员）；
3. 全员通过短链访问。

## 四、更新制度文档

1. 替换 `docs/` 下的 docx；
2. 运行 `python scripts/extract_docs.py` 重新切分；
3. 运行 `python scripts/gen_data_js.py` 重新生成索引；
4. 重新部署 `app/` 目录。

## 五、获取 DeepSeek API Key

1. 访问 https://platform.deepseek.com 注册并实名；
2. 创建 API Key（形如 `sk-...`）；
3. 充值少量金额（内部问答消耗极低，10 元可用很久）；
4. 将 Key 配置到代理环境变量，**不要**写进前端代码。
