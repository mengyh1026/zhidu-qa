/**
 * 测试腾讯云函数 URL 端到端可用性
 */
const PROXY_URL = process.argv[2] || "https://1476023346-4nnqmdmu53.ap-guangzhou.tencentscf.com";

const payload = {
  question: "阿联酋的增值税税率是多少？",
  context: [
    {
      section: "阿联酋 · 第四章 税收制度 · 增值税",
      text: "阿联酋自2018年1月1日起征收增值税（VAT），标准税率为5%。所有从事应税销售的企业年销售额超过375,000迪拉姆的，必须注册增值税。"
    },
    {
      section: "阿联酋 · 第四章 税收制度 · 增值税申报",
      text: "增值税纳税人须按季度向联邦税务局（FTA）申报并缴纳增值税，申报截止日期为纳税期结束后28天内。"
    }
  ]
};

(async () => {
  console.log("POST", PROXY_URL);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60000);
  try {
    const resp = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    console.log("HTTP", resp.status);
    const text = await resp.text();
    console.log("---- 响应 ----");
    console.log(text.slice(0, 1500));
    try {
      const data = JSON.parse(text);
      if (data.answer) {
        console.log("\n✅ 测试通过：AI 正常返回回答");
      } else if (data.error) {
        console.log("\n❌ 服务返回错误:", data.error);
      }
    } catch (e) {
      console.log("\n⚠️ 返回的不是 JSON，可能事件格式不匹配");
    }
  } catch (e) {
    clearTimeout(timer);
    console.log("❌ 请求失败:", e.message);
    console.log("提示：如果是超时，请检查云函数「执行超时时间」是否设为 60 秒");
  }
})();
