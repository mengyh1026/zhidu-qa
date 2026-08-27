# -*- coding: utf-8 -*-
# 雾霾蓝配色：低饱和蓝，专业耐看
import os, io

BASE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PORTABLE = os.path.join(os.path.dirname(BASE), "app", "index.html")

FILES = [
    os.path.join(BASE, "app", "index.html"),
    os.path.join(BASE, "index.html"),
    os.path.join(BASE, "gh-pages", "index.html"),
]

# 旧(粉色马卡龙) -> 新(雾霾蓝)
PAIRS = [
    # 调色板变量
    ("--primary: #e8709a;", "--primary: #5b8db8;"),
    ("--primary-dark: #d95c8c;", "--primary-dark: #4a7ca8;"),
    ("--primary-light: #fdeef4;", "--primary-light: #edf3f8;"),
    ("--accent: #7fc8c2;", "--accent: #8fb5ae;"),
    ("--bg: #faf6f8;", "--bg: #f7f9fb;"),
    # body 渐变背景
    ("background: linear-gradient(160deg, #fdf3f7 0%, #faf6f8 40%, #f2f9f8 100%);",
     "background: linear-gradient(160deg, #f0f5f9 0%, #f7f9fb 40%, #f2f7f4 100%);"),
    # 头部 logo 渐变
    ("background: linear-gradient(135deg, #f2a0bd 0%, #e8709a 55%, #d95c8c 100%);",
     "background: linear-gradient(135deg, #7ea6c6 0%, #5b8db8 55%, #4a7ca8 100%);"),
    # 用户气泡
    (".msg.user .bubble { background: linear-gradient(135deg, #ef8fb1, #e8709a); color: #fff; border-top-right-radius: 4px; }",
     ".msg.user .bubble { background: linear-gradient(135deg, #7fa3c4, #5b8db8); color: #fff; border-top-right-radius: 4px; }"),
    # 表头底色
    (".bubble th { background: #fdeef4; }", ".bubble th { background: #edf3f8; }"),
    # 输入框焦点光圈
    ("textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(232,112,154,.15); }",
     "textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(91,141,184,.15); }"),
]

result = []
for p in FILES:
    html = io.open(p, encoding="utf-8").read()
    missed = [a for a, b in PAIRS if a not in html]
    for a, b in PAIRS:
        html = html.replace(a, b)
    io.open(p, "w", encoding="utf-8").write(html)
    result.append((os.path.relpath(p, BASE), missed))

# 重新打包桌面版（内联 data.js）
data_js = io.open(os.path.join(BASE, "app", "data.js"), encoding="utf-8").read()
html = io.open(FILES[0], encoding="utf-8").read()
single = html.replace('<script src="data.js"></script>', '<script>\n' + data_js + '\n</script>')
desktop = r"C:/Users/admin/Desktop/海诚股份境外财务管理-问答助手.html"
io.open(desktop, "w", encoding="utf-8").write(single)

for name, missed in result:
    print(name, "missed:", len(missed), missed if missed else "")
print("desktop KB =", os.path.getsize(desktop) // 1024)
print("OUTPUT=" + desktop)
