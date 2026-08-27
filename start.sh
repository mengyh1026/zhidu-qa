#!/bin/bash
# 一键启动境外财务管理问答助手（本地版）
# 启动后访问 http://localhost:8080 即可使用

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR="$SCRIPT_DIR/server"
APP_DIR="$SCRIPT_DIR/app"

echo "🚀 正在启动问答助手..."

# 加载 .env
if [ -f "$SERVER_DIR/.env" ]; then
  export $(grep -v '^#' "$SERVER_DIR/.env" | xargs)
fi

# 启动后端代理（后台）
echo "📡 启动后端代理 (端口 9000)..."
cd "$SERVER_DIR"
node index.js &
SERVER_PID=$!
sleep 1

# 启动前端静态服务（用 Node 内置 http-server 或 Python）
echo "🌐 启动前端服务 (端口 8080)..."
cd "$APP_DIR"

# 优先用 python3 -m http.server
if command -v python3 &>/dev/null; then
  python3 -m http.server 8080 &
elif command -v python &>/dev/null; then
  python -m http.server 8080 &
else
  # 用 Node.js 手写一个极简静态服务
  node -e "
const http=require('http'),fs=require('fs'),path=require('path');
const MIME={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png'};
http.createServer((req,res)=>{
  let fp=path.join('.',req.url==='/'?'index.html':req.url);
  fs.readFile(fp,(e,data)=>{
    if(e){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':MIME[path.extname(fp)]||'text/plain','Access-Control-Allow-Origin':'*'});
    res.end(data);
  });
}).listen(8080,()=>console.log('前端服务已启动'));
" &
fi
FRONTEND_PID=$!

sleep 1
echo ""
echo "=========================================="
echo "  ✅ 问答助手已启动！"
echo ""
echo "  📌 打开浏览器访问: http://localhost:8080"
echo ""
echo "  📌 停止服务: Ctrl+C"
echo "=========================================="

# 捕获退出信号，清理后台进程
trap "kill $SERVER_PID $FRONTEND_PID 2>/dev/null; echo '已停止'" EXIT INT TERM
wait
