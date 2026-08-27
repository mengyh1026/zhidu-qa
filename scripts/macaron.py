# -*- coding: utf-8 -*-
"""马卡龙配色 + 字体放大：应用到 app/index.html，并同步 root/gh-pages/桌面单文件版。"""
import os

BASE = r"C:/Users/admin/.wpscomate/agent/workspace/zhidu-qa"
APP = os.path.join(BASE, "app", "index.html")

html = open(APP, encoding="utf-8").read()

# ---------- 1. 马卡龙配色（换 CSS 变量 + 渐变/背景/强调色） ----------
pairs = [
    # 变量定义整块替换为马卡龙色系
    (
        ":root {\n    --primary: #1a5fb4;\n    --primary-dark: #124a8f;\n    --primary-light: #e8f0fb;\n    --accent: #e8a33d;\n    --bg: #f4f6fa;",
        ":root {\n    --primary: #e8709a;\n    --primary-dark: #d95c8c;\n    --primary-light: #fdeef4;\n    --accent: #7fc8c2;\n    --bg: #faf6f8;",
    ),
    # 页面背景加一层马卡龙渐变的柔和底色
    (
        "  body {\n    font-family: \"Microsoft YaHei\", \"PingFang SC\", \"Helvetica Neue\", Arial, sans-serif;\n    background: var(--bg);",
        "  body {\n    font-family: \"Microsoft YaHei\", \"PingFang SC\", \"Helvetica Neue\", Arial, sans-serif;\n    background: linear-gradient(160deg, #fdf3f7 0%, #faf6f8 40%, #f2f9f8 100%);",
    ),
    # header 渐变换成马卡龙粉
    (
        "  header {\n    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);",
        "  header {\n    background: linear-gradient(135deg, #f2a0bd 0%, #e8709a 55%, #d95c8c 100%);",
    ),
    # 欢迎标题色
    (
        ".welcome h2 { font-size: 22px; color: var(--primary-dark); margin-bottom: 8px; }",
        ".welcome h2 { font-size: 24px; color: #c94f7c; margin-bottom: 8px; }",
    ),
    # chip 悬停马卡龙薄荷
    (
        ".chip:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }",
        ".chip:hover { border-color: #7fc8c2; color: #3d9b94; background: #eaf7f6; }",
    ),
    # 用户气泡换成马卡龙粉
    (
        ".msg.user .bubble { background: var(--primary); color: #fff; border-top-right-radius: 4px; }",
        ".msg.user .bubble { background: linear-gradient(135deg, #ef8fb1, #e8709a); color: #fff; border-top-right-radius: 4px; }",
    ),
    # 机器人头像渐变
    (
        ".msg.bot .avatar { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: #fff; }",
        ".msg.bot .avatar { background: linear-gradient(135deg, #a5d8d3, #7fc8c2); color: #fff; }",
    ),
    # 表头背景用马卡龙浅粉
    (
        ".bubble th { background: var(--primary-light); }",
        ".bubble th { background: #fdeef4; }",
    ),
    # 参考来源标签
    (
        "  .source .tag {\n    display: inline-block;\n    background: var(--primary-light);\n    color: var(--primary-dark);",
        "  .source .tag {\n    display: inline-block;\n    background: #eaf7f6;\n    color: #3d9b94;",
    ),
    # 输入框聚焦光晕改粉
    (
        "textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(26,95,180,.12); }",
        "textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(232,112,154,.15); }",
    ),
    # 提示条改马卡龙薄荷风
    (
        "  .notice {\n    background: #fff7ed;\n    border: 1px solid #fed7aa;\n    color: #9a3412;",
        "  .notice {\n    background: #fef6f9;\n    border: 1px solid #f7c6d9;\n    color: #b0456e;",
    ),
]

# ---------- 2. 字体放大 ----------
size_pairs = [
    ("header .title { font-size: 17px;", "header .title { font-size: 18px;"),
    ("header .subtitle { font-size: 12px;", "header .subtitle { font-size: 13px;"),
    (".welcome p { color: var(--text-sub); font-size: 14px;", ".welcome p { color: var(--text-sub); font-size: 15px;"),
    ("    border-radius: 20px;\n    padding: 8px 16px;\n    font-size: 13px;", "    border-radius: 20px;\n    padding: 9px 18px;\n    font-size: 14px;"),
    ("    border-radius: var(--radius);\n    font-size: 14px;\n    line-height: 1.7;", "    border-radius: var(--radius);\n    font-size: 15px;\n    line-height: 1.75;"),
    (".bubble h1, .bubble h2, .bubble h3 { margin: 10px 0 6px; font-size: 15px; }", ".bubble h1, .bubble h2, .bubble h3 { margin: 10px 0 6px; font-size: 16px; }"),
    (".bubble table { border-collapse: collapse; margin: 8px 0; width: 100%; font-size: 13px; }", ".bubble table { border-collapse: collapse; margin: 8px 0; width: 100%; font-size: 14px; }"),
    ("    border: 1px dashed var(--border);\n    font-size: 12px;\n    color: var(--text-sub);", "    border: 1px dashed var(--border);\n    font-size: 13px;\n    color: var(--text-sub);"),
    ("    padding: 12px 14px;\n    font-size: 14px;\n    font-family: inherit;", "    padding: 12px 14px;\n    font-size: 15px;\n    font-family: inherit;"),
    ("    padding: 12px 22px;\n    font-size: 14px;", "    padding: 12px 22px;\n    font-size: 15px;"),
]

# textarea 的 font-size 在上面第9条里已覆盖（'font-size: 14px;\n    font-family'结构）
# 但 textarea 规则实际顺序是 padding/font-size/font-family? 检查两种顺序
all_pairs = pairs + size_pairs
missed = []
for a, b in all_pairs:
    if a in html:
        html = html.replace(a, b)
    else:
        missed.append(a[:60])

# textarea font-size 兜底：规则体内 'font-size: 14px;'（如未命中上面的组合）
for a, b in [("    resize: none;\n    outline: none;", "    resize: none;\n    outline: none;")]:
    html = html.replace(a, b)

open(APP, "w", encoding="utf-8").write(html)

# 同步 root（线上文件）与 gh-pages
open(os.path.join(BASE, "index.html"), "w", encoding="utf-8").write(html)
open(os.path.join(BASE, "gh-pages", "index.html"), "w", encoding="utf-8").write(html)

# 桌面单文件版（内联 data.js，保留 PROXY_URL）
data_js = open(os.path.join(BASE, "app", "data.js"), encoding="utf-8").read()
single = html.replace('<script src="data.js"></script>', "<script>\n" + data_js + "\n</script>")
desktop = r"C:/Users/admin/Desktop/海诚股份境外财务管理-问答助手.html"
open(desktop, "w", encoding="utf-8").write(single)

print("missed:", missed if missed else "none")
print("desktop KB =", os.path.getsize(desktop) // 1024)
print("OUTPUT=" + os.path.abspath(desktop))
