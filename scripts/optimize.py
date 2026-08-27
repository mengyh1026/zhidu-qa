# -*- coding: utf-8 -*-
# 2026-08-28 优化：视觉收尾(粉色残留) + 清空对话/复制回答 + 国别筛选 + 手机适配
import os, re

BASE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
APP = os.path.join(BASE, "app", "index.html")

html = open(APP, encoding="utf-8").read()
missed = []

def rep(a, b, must=True):
    global html
    if a in html:
        html = html.replace(a, b, 1)
    else:
        missed.append(a[:48])

# ============ 1. 视觉收尾：粉色残留改蓝色系 ============
rep(".welcome h2 { font-size: 24px; color: #c94f7c;", ".welcome h2 { font-size: 24px; color: var(--primary-dark);")
rep("""  .chip:hover { border-color: #7fc8c2; color: #3d9b94; background: #eaf7f6; }""",
    """  .chip:hover { border-color: var(--primary); color: var(--primary-dark); background: var(--primary-light); }""")
rep("""  .notice {
    background: #fef6f9;
    border: 1px solid #f7c6d9;
    color: #b0456e;""",
    """  .notice {
    background: #fdf6ec;
    border: 1px solid #ead9b8;
    color: #9a6b1f;""")
rep("""  .msg.bot .avatar { background: linear-gradient(135deg, #a5d8d3, #7fc8c2); color: #fff; }""",
    """  .msg.bot .avatar { background: linear-gradient(135deg, #8fb5ae, #7aa89f); color: #fff; }""")
rep("""  .source .tag {
    display: inline-block;
    background: #eaf7f6;
    color: #3d9b94;""",
    """  .source .tag {
    display: inline-block;
    background: var(--primary-light);
    color: var(--primary-dark);""")
rep("""  .bubble th { background: #fdeef4; }""", """  .bubble th { background: var(--primary-light); }""")

# ============ 2. 手机适配 ============
rep("""  header {
    background: linear-gradient(135deg, #7ea6c6 0%, #5b8db8 55%, #4a7ca8 100%);
    color: #fff;
    padding: 14px 24px;""",
    """  @media (max-width: 640px) {
    header { padding: 10px 14px; gap: 10px; }
    header .logo { width: 34px; height: 34px; font-size: 17px; }
    header .title { font-size: 15px; }
    header .subtitle { font-size: 11px; }
    .container { padding: 0 12px; }
    .welcome h2 { font-size: 19px; }
    .welcome p { font-size: 14px; }
    .chip { padding: 8px 14px; font-size: 13px; }
    .bubble { max-width: 86%; font-size: 15px; padding: 10px 13px; }
    .msg .avatar { width: 30px; height: 30px; font-size: 14px; }
    .inputbar { gap: 8px; }
    textarea { padding: 10px 12px; min-height: 44px; }
    .sendbtn { padding: 10px 16px; font-size: 14px; }
    .countrybar { padding: 8px 12px 0; }
  }
  header {
    background: linear-gradient(135deg, #7ea6c6 0%, #5b8db8 55%, #4a7ca8 100%);
    color: #fff;
    padding: 14px 24px;""")

# ============ 3. 新增样式：国别筛选条 + 操作按钮 ============
rep("""  main {
    flex: 1;
    overflow-y: auto;
    padding: 20px 0;
  }""",
    """  main {
    flex: 1;
    overflow-y: auto;
    padding: 20px 0;
  }
  .countrybar {
    max-width: 860px; margin: 0 auto; padding: 0 20px;
    display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
  }
  .cbtn {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 6px 14px;
    font-size: 13px;
    color: var(--text-sub);
    cursor: pointer;
    transition: all .2s;
  }
  .cbtn:hover { border-color: var(--primary); }
  .cbtn.active {
    background: var(--primary);
    border-color: var(--primary);
    color: #fff;
  }
  .countrybar .clabel { font-size: 13px; color: var(--text-sub); margin-right: 2px; }""")
rep("""  .hint { text-align: center; color: var(--text-sub); font-size: 12px; margin-top: 8px; }""",
    """  .hint { text-align: center; color: var(--text-sub); font-size: 12px; margin-top: 8px; }
  .msg-tools { margin-top: 8px; display: flex; gap: 10px; }
  .toolbtn {
    background: none; border: none; cursor: pointer;
    font-size: 12px; color: var(--text-sub); padding: 0;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .toolbtn:hover { color: var(--primary-dark); }
  .toolbtn.copied { color: #2e8b57; }""")
rep("""  header .badge {
    margin-left: auto;
    background: rgba(255,255,255,.18);
    border: 1px solid rgba(255,255,255,.3);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
  }""",
    """  header .badge {
    margin-left: auto;
    background: rgba(255,255,255,.18);
    border: 1px solid rgba(255,255,255,.3);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    cursor: pointer;
    user-select: none;
  }""")

# ============ 4. HTML 结构：header 按钮改为清空；countrybar 插入 ============
rep("""  <div class="badge">阿联酋 · 摩洛哥</div>
</header>""",
    """  <div class="badge" id="clearBtn" title="清空对话">🗑 清空</div>
</header>""")
rep("""    <div class="chips" id="chips">""",
    """    <div class="chips" id="chips">""")
marker = '<div class="welcome" id="welcome">'
assert marker in html
i = html.index('<main id="main">')
j = html.index(marker)
countrybar = '''<main id="main">
  <div class="countrybar" id="countrybar">
    <span class="clabel">范围：</span>
    <button class="cbtn active" data-c="全部">全部</button>
    <button class="cbtn" data-c="阿联酋">🇦🇪 阿联酋</button>
    <button class="cbtn" data-c="摩洛哥">🇲🇦 摩洛哥</button>
  </div>
'''
html = html[:i] + countrybar + html[i + len('<main id="main">'):]
# welcome 位于 container 内不受影响；不删原 marker

# ============ 5. JS：国别筛选 + 清空 + 复制 + 检索过滤 ============
rep("""// ============ 聊天 UI ============""",
    """// ============ 国别筛选 ============
let CURRENT_COUNTRY = "全部";
document.getElementById("countrybar").addEventListener("click", e => {
  const btn = e.target.closest(".cbtn");
  if (!btn) return;
  CURRENT_COUNTRY = btn.dataset.c;
  document.querySelectorAll(".cbtn").forEach(b => b.classList.toggle("active", b === btn));
});

// ============ 清空对话 ============
document.getElementById("clearBtn").addEventListener("click", () => {
  if (chatEl.children.length === 0) return;
  if (!confirm("确定清空当前对话吗？")) return;
  chatEl.innerHTML = "";
  welcomeEl.style.display = "";
  inputEl.focus();
});

// ============ 聊天 UI ============""")

def _unused(): pass

rep("""function sourceHtml(results) {
  if (!results || results.length === 0) return "";
  const tags = results.map(r => `<span class="tag">${r.c} · ${r.s}</span>`).join("");
  return `<div class="source">📎 参考来源：${tags}</div>`;
}""",
    """function sourceHtml(results) {
  if (!results || results.length === 0) return "";
  const tags = results.map(r => `<span class="tag">${r.c} · ${r.s}</span>`).join("");
  return `<div class="source">📎 参考来源：${tags}</div>`;
}

function addTools(div, getPlain) {
  const tools = document.createElement("div");
  tools.className = "msg-tools";
  const btn = document.createElement("button");
  btn.className = "toolbtn";
  btn.textContent = "📋 复制";
  btn.addEventListener("click", () => {
    const done = ok => { btn.textContent = ok ? "✅ 已复制" : "❌ 复制失败"; btn.classList.add("copied");
      setTimeout(() => { btn.textContent = "📋 复制"; btn.classList.remove("copied"); }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(getPlain()).then(() => done(true), () => done(false));
    } else {
      try {
        const ta = document.createElement("textarea");
        ta.value = getPlain(); document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); ta.remove(); done(true);
      } catch (e) { done(false); }
    }
  });
  tools.appendChild(btn);
  div.querySelector(".bubble").appendChild(tools);
}""")

# ask() 内应用国别过滤
rep("""  const results = search(q, 5);
  const context = results.map(r => ({ section: r.s, text: r.t }));""",
    """  const allHits = search(q, 10);
  const results = CURRENT_COUNTRY === "全部" ? allHits.slice(0, 5)
    : allHits.filter(r => r.c === CURRENT_COUNTRY).slice(0, 5);
  const context = results.map(r => ({ section: r.s, text: r.t }));""")

# 生成式回答后挂复制按钮
rep("""  removeTyping();
  if (answer) {
    addMsg("bot", renderMarkdown(answer) + sourceHtml(results));
  } else {""",
    """  removeTyping();
  if (answer) {
    const div = addMsg("bot", renderMarkdown(answer) + sourceHtml(results));
    addTools(div, () => answer);
  } else {""")

# 检索模式回答显示当前范围提示
rep("""      html = `<p>当前为<b>检索模式</b>（生成式服务未配置或不可用），为您找到以下相关条文：</p>`;""",
    """      const scope = CURRENT_COUNTRY === "全部" ? "" : `（范围：${CURRENT_COUNTRY}）`;
      html = `<p>当前为<b>检索模式</b>${scope}，为您找到以下相关条文：</p>`;""")

# 未命中时的提示带上国别
rep("""      html = `<p>抱歉，未在指南中找到相关内容。请尝试换个问法，或补充国别（阿联酋/摩洛哥）与关键词。</p>`;""",
    """      const tip = CURRENT_COUNTRY === "全部" ? "请尝试换个问法，或补充国别（阿联酋/摩洛哥）与关键词。"
        : `「${CURRENT_COUNTRY}」范围内未命中，可切回「全部」再试。`;
      html = `<p>抱歉，未在指南中找到相关内容。${tip}</p>`;""")

open(APP, "w", encoding="utf-8").write(html)

# 同步三处
open(os.path.join(BASE, "index.html"), "w", encoding="utf-8").write(html)
open(os.path.join(BASE, "gh-pages", "index.html"), "w", encoding="utf-8").write(html)

# 桌面单文件
data_js = open(os.path.join(BASE, "app", "data.js"), encoding="utf-8").read()
single = html.replace('<script src="data.js"></script>', '<script>\n' + data_js + '\n</script>')
desktop = r"C:/Users/admin/Desktop/海诚股份境外财务管理-问答助手.html"
open(desktop, "w", encoding="utf-8").write(single)

print("missed:", len(missed))
for m in missed: print("  -", m)
print("desktop KB =", os.path.getsize(desktop)//1024)
print("proxy kept:", "tencentscf.com" in html)
print("OUTPUT=" + os.path.abspath(desktop))
