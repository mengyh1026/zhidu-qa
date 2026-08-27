# -*- coding: utf-8 -*-
"""把 index.html + data.js 合并成单个自包含 HTML 文件。"""
import os

BASE = r"C:/Users/admin/.wpscomate/agent/workspace/zhidu-qa"
app_dir = os.path.join(BASE, "app")

with open(os.path.join(app_dir, "index.html"), "r", encoding="utf-8") as f:
    html = f.read()

with open(os.path.join(app_dir, "data.js"), "r", encoding="utf-8") as f:
    data_js = f.read()

# 替换 <script src="data.js"></script> 为内联
html = html.replace('<script src="data.js"></script>', f'<script>\n{data_js}\n</script>')

# 清空 PROXY_URL（确保纯本地可用）
import re
html = re.sub(r'const PROXY_URL\s*=\s*"[^"]*";', 'const PROXY_URL = "";', html)

out = os.path.join(BASE, "境外财务管理问答助手.html")
with open(out, "w", encoding="utf-8") as f:
    f.write(html)

size_kb = os.path.getsize(out) // 1024
print(f"✅ 已生成：{out}（{size_kb} KB）")
print(f"OUTPUT={os.path.abspath(out)}")
