#!/bin/bash
# 一键更新国别指南内容
# 用法：把新的 docx 放到 docs/ 目录后，运行 bash update.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCS_DIR="$SCRIPT_DIR/docs"
PYTHON="D:/apple-WPSAI/WPS Comate/scripts/apps/basic/tools/python/versions/3.12.12/python.exe"
NODE="D:/apple-WPSAI/WPS Comate/scripts/apps/basic/tools/node/versions/22.22.2/node.exe"

echo "📋 当前 docs/ 目录下的文档："
ls -1 "$DOCS_DIR"/*.docx 2>/dev/null | while read f; do
  echo "  · $(basename "$f") ($(du -h "$f" | cut -f1))"
done
echo ""

# 第一步：重新提取文档内容
echo "🔍 第一步：提取文档内容..."
cd "$SCRIPT_DIR"
"$PYTHON" scripts/extract_docs.py
echo ""

# 第二步：重新生成前端索引
echo "📦 第二步：生成前端索引 data.js..."
"$PYTHON" scripts/gen_data_js.py
echo ""

# 第三步：重启服务
echo "🔄 第三步：重启服务..."

# 杀掉旧的前端服务（8080端口）
OLD_PID=$(netstat -ano 2>/dev/null | grep ":8080.*LISTENING" | awk '{print $NF}' | head -1)
if [ -n "$OLD_PID" ]; then
  taskkill //F //PID "$OLD_PID" 2>/dev/null
  echo "  已停止旧的前端服务 (PID: $OLD_PID)"
fi

# 重新启动前端服务
cd "$SCRIPT_DIR/app"
"$NODE" -e "
const http = require('http'), fs = require('fs'), path = require('path');
const MIME = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css','.json':'application/json','.png':'image/png'};
http.createServer((req, res) => {
  const fp = path.join('.', req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type': MIME[path.extname(fp)] || 'text/plain', 'Access-Control-Allow-Origin': '*'});
    res.end(data);
  });
}).listen(8080, '0.0.0.0', () => console.log('  ✅ 前端服务已重启'));
" &

sleep 2
echo ""
echo "=========================================="
echo "  ✅ 更新完成！"
echo ""
echo "  📌 刷新浏览器 http://localhost:8080 即可"
echo "=========================================="
