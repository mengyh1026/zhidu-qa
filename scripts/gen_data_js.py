# -*- coding: utf-8 -*-
"""把 chunks.json 转成前端可用的 data.js（内嵌检索索引）。"""
import json, os

BASE = r"C:/Users/admin/.wpscomate/agent/workspace/zhidu-qa"
chunks = json.load(open(os.path.join(BASE, "data/chunks.json"), encoding="utf-8"))

# 精简字段，控制体积
items = [{"c": c["country"], "s": c["section"], "t": c["text"]} for c in chunks]

js = "// 自动生成：境外财务管理操作指南检索索引\n"
js += "window.ZHIDU_INDEX = " + json.dumps(items, ensure_ascii=False) + ";\n"

out = os.path.join(BASE, "app", "data.js")
with open(out, "w", encoding="utf-8") as f:
    f.write(js)
print(f"已生成 {out}，共 {len(items)} 条，{os.path.getsize(out)//1024} KB")
print(f"OUTPUT={os.path.abspath(out)}")
