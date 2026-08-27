// 模拟"别人双击打开桌面 html"场景：file:// 页面发请求时 Origin 为 null
const https = require("https");

const URL_STR = "https://1476023346-4nnqmdmu53.ap-guangzhou.tencentscf.com";

function req(method, origin, extraHeaders, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(URL_STR);
    const r = https.request(u, {
      method,
      headers: Object.assign({ Origin: origin }, extraHeaders),
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    r.on("error", reject);
    if (body) r.write(body);
    r.end();
  });
}

(async () => {
  // 1) 预检请求（浏览器跨域时的自动探测）
  const pre = await req("OPTIONS", "null", {
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "content-type",
  });
  console.log("== 预检 OPTIONS ==", pre.status);
  console.log("  Allow-Origin响应头:", pre.headers["access-control-allow-origin"]);

  // 2) 真实 POST（模拟 file:// 打开的页面调用）
  const post = await req("POST", "null", {
    "Content-Type": "application/json",
  }, JSON.stringify({
    question: "阿联酋的增值税税率是多少？",
    context: [{ section: "阿联酋 / 4.2.1 增值税", text: "阿联酋自2018年1月1日起征收增值税（VAT），标准税率为5%。适用零税率的包括出口货物、国际运输等。" }],
  }));
  console.log("== 真实 POST ==", post.status);
  console.log("  Allow-Origin响应头:", post.headers["access-control-allow-origin"]);
  let ans = "";
  try { ans = JSON.parse(post.body).answer || ""; } catch (e) { ans = post.body.slice(0, 120); }
  console.log("  AI回答:", ans.slice(0, 150));

  const ok = pre.headers["access-control-allow-origin"] === "*" &&
             post.headers["access-control-allow-origin"] === "*" &&
             post.status === 200 && ans.length > 5;
  console.log(ok ? "✅ 通了！本地文件/任意来源都能用AI回答" : "❌ 仍有问题，需要排查");
})();
