/* ============================================================
 * zhidu-qa 员工自测题
 * 题库全部出自《境外财务管理操作指南》真实条文，每题带解析与出处
 * 交互：header「📝 自测」→ 选范围 → 逐题作答（即时刻对错+解析）→ 成绩单+错题回看
 * 主题适配：全部使用 index.html 的 CSS 变量，三套主题自动跟随
 * 用法：<script src="quiz.js" defer></script>，页面放 <div id="quizBtn">
 * ============================================================ */
(function () {
  "use strict";

  /* ---------------- 题库（verified against data.js 条文） ---------------- */
  var QUIZ_BANK = [
    /* ===== 阿联酋 ===== */
    { c: "阿联酋", q: "阿联酋增值税（VAT）的标准税率是多少？",
      opts: ["5%", "9%", "15%", "20%"], a: 0,
      exp: "根据《增值税法》（2017年联邦第8号法令），阿联酋自2018年1月1日起征收增值税，标准税率5%。9%是企业所得税税率，注意勿混淆。",
      src: "阿联酋 · 4.2.2 增值税" },
    { c: "阿联酋", q: "阿联酋增值税强制登记的门槛是：连续12个月营业额达到多少？",
      opts: ["≥18.75万迪拉姆", "≥30万迪拉姆", "≥37.5万迪拉姆", "≥100万迪拉姆"], a: 2,
      exp: "连续12个月营业额≥37.5万迪拉姆强制登记；18.75万–37.5万迪拉姆可自愿登记。18.75万是自愿登记下限，不是强制线。",
      src: "阿联酋 · 4.1.1 税务管理机构" },
    { c: "阿联酋", q: "自贸区企业若适用0%企业所得税率，是否还需要税务登记和年度申报？",
      opts: ["税率为0%，无需登记也无需申报", "需登记一次，之后无需每年申报", "必须登记并每年年度申报，逾期有高额罚款", "仅当有利润时才需要申报"], a: 2,
      exp: "即便自贸区企业适用0%税率，也必须通过 EmaraTax 完成登记并每年年度申报，逾期将面临高额罚款——0%不等于免税免申报。",
      src: "阿联酋 · 4.1.1 税务管理机构" },
    { c: "阿联酋", q: "阿联酋企业所得税的税率为多少？小微企业豁免的利润界限是？",
      opts: ["5%；利润≤18.75万迪拉姆部分免税", "9%；利润≤37.5万迪拉姆部分免税", "15%；利润≤50万迪拉姆部分免税", "20%；无小微豁免"], a: 1,
      exp: "企业所得税标准税率9%，子公司利润≤37.5万迪拉姆部分享受小微豁免免税。37.5万这个数字在增值税登记门槛和企业所得税小微豁免两处出现，语义不同，注意区分场景。",
      src: "阿联酋 · 附表2 / 4.2.1 企业所得税" },
    { c: "阿联酋", q: "阿联酋企业所得税（财年1月1日-12月31日）的年度申报及全额缴税截止日是？",
      opts: ["当年12月31日前", "次年3月31日前", "次年6月30日前", "次年9月30日前"], a: 3,
      exp: "年度申报无强制预缴，次年9月30日前一次性申报并全额缴税。",
      src: "阿联酋 · 附表2" },
    { c: "阿联酋", q: "自贸区合格企业（QFZP）若未按要求进行年度法定审计，后果是？",
      opts: ["补交审计报告即可，无实质影响", "取消0%免税资格，按9%计税", "仅予以警告并限期整改", "暂停营业执照"], a: 1,
      exp: "QFZP（享0%企业所得税）必须完成年度法定审计，否则取消免税资格、全额按9%计税——审计不是可选项，而是税收优惠的前提。",
      src: "阿联酋 · 4.1.2 会计与审计监管" },
    { c: "阿联酋", q: "阿联酋企业所得税法要求年收入达到多少的企业，申报时必须提交审计财报？",
      opts: ["≥1000万迪拉姆", "≥3000万迪拉姆", "≥5000万迪拉姆", "≥1亿迪拉姆"], a: 2,
      exp: "年收入≥5,000万迪拉姆必须提交审计财报用于企业所得税申报（财政部决议第84/2025号）。",
      src: "阿联酋 · 4.1.2 会计与审计监管" },
    { c: "阿联酋", q: "通过 WPS 系统发放工资时，若企业逾期发薪、漏发或薪资与合同不符，后果是？",
      opts: ["书面警告，不涉及签证", "仅对企业罚款，不影响签证", "冻结该公司所有新工作签审批、现有签证无法续签，并处单人1,000迪拉姆起罚款", "冻结公司银行账户"], a: 2,
      exp: "WPS 违规会导致系统自动冻结该公司所有新工作签审批、现有签证无法续签，并处单人1,000迪拉姆起罚款——直接影响人员进出，务必按期通过 WPS 发薪。",
      src: "阿联酋 · 5.2.2 资金管理（中方人员工资）" },
    { c: "阿联酋", q: "阿联酋非自贸区企业账户，现金存现的单笔限制为？",
      opts: ["≤5万迪拉姆", "≤20万迪拉姆", "≤50万迪拉姆", "无限制"], a: 1,
      exp: "非自贸区企业账户现金存现多限制在单笔≤20万迪拉姆，超额需说明用途与来源。且现金不得用于支付工程款与工资。",
      src: "阿联酋 · 5.2.2 资金管理" },
    { c: "阿联酋", q: "阿联酋对年应税营业额的增值税申报周期划分是？",
      opts: ["一律按月申报", "一律按季度申报", "<1.5亿迪拉姆按季度、≥1.5亿迪拉姆按月申报", "<1.5亿迪拉姆按年、≥1.5亿迪拉姆按季度申报"], a: 2,
      exp: "年应税营业额<1.5亿迪拉姆按季度申报，≥1.5亿迪拉姆按月申报，申报期限均为周期结束后28天内。",
      src: "阿联酋 · 4.2.2 增值税" },
    { c: "阿联酋", q: "阿联酋 B2B/B2G 交易强制实施电子发票（通过认证服务商开具并实时上报税局）的起始时间是？",
      opts: ["2026年1月1日", "2026年7月1日", "2027年1月1日", "2028年7月1日"], a: 1,
      exp: "2026年7月1日起 B2B/B2G 交易强制实施电子发票（XML/JSON 格式，优先 XML），需通过财政部与 FTA 官方认证的服务商（ASP）开具，B2C 暂不强制。",
      src: "阿联酋 · 4.2.2 增值税" },
    { c: "阿联酋", q: "在阿联酋设立子公司办理国内资金出境，ODI 备案需在哪个部门完成？",
      opts: ["发改委备案 + 商务部备案", "仅商务部备案", "仅外汇管理局备案", "财政部备案"], a: 0,
      exp: "ODI 路径：发改委备案 + 商务部备案（项目实施前完成，集团总部提交申请）→ 国内银行外汇登记 + 开立 ODI 专户 → 境外公司注册 → 阿联酋银行开户 → 资金汇出。",
      src: "阿联酋 · 4.3 外汇及资金管制政策" },
    { c: "阿联酋", q: "阿联酋子公司进入清算期后，剩余资金向股东汇回的正确路径是？",
      opts: ["账户余额直接汇给股东，无需任何程序", "由法定清算人按法定顺序清偿债务后，剩余资金才能分配给股东并汇出", "股东自行转账，事后向税局报备即可", "先分配利润，债务留待注销后处理"], a: 1,
      exp: "清算期账户被监管锁定，必须由法定清算人按法定顺序清偿债务后，剩余资金才能分配股东并汇出（银行凭清算人委任函、最终清算报告、完税证明、注销证书办理，无额度限制）。",
      src: "阿联酋 · 5.3.3 资金管理" },

    /* ===== 摩洛哥 ===== */
    { c: "摩洛哥", q: "摩洛哥增值税（VAT）的正常税率为多少？",
      opts: ["5%", "10%", "14%", "20%"], a: 3,
      exp: "摩洛哥增值税正常税率20%，另有7%、10%、14%三档低税率适用于特定商品和服务。阿联酋是5%，两国勿混淆。",
      src: "摩洛哥 · 4.2.2 增值税" },
    { c: "摩洛哥", q: "位于摩洛哥「产业加速区」的项目享受增值税免税时，承包商的实操要点是？",
      opts: ["免税自动适用于承包商，无需额外操作", "承包商须向业主开具不含税发票，进项垫付税金由承包商向税务机关申请退税", "承包商应向业主按20%开票，再自行申请免税", "承包商可将项目迁出加速区以规避增值税"], a: 1,
      exp: "免税优惠通常直接授予业主，并不自动延伸至承包商：承包商须向业主开不含税发票，但向分包商采购时仍支付含税价，差额向税局申请退税，预算中应单独列示（建议按3-6个月退税周期测算资金占用成本）。",
      src: "摩洛哥 · 4.2.2 增值税" },
    { c: "摩洛哥", q: "2026年摩洛哥向非居民企业支付股息的预提税率是？",
      opts: ["5%", "10%", "11.25%", "15%"], a: 2,
      exp: "2026年向非居民支付股息的过渡期税率为11.25%，2027年起降至10%；利息和特许权使用费预提税率均为10%。",
      src: "摩洛哥 · 4.2.3 预提税" },
    { c: "摩洛哥", q: "根据中摩税收协定，受益所有人为中国居民企业时，摩洛哥对股息、利息、特许权使用费适用的税率上限为？",
      opts: ["5%", "10%", "15%", "20%"], a: 1,
      exp: "中摩税收协定第十、十一、十二条对来源地征税额进行了限制：受益所有人为中国居民时，摩洛哥适用税率最高为10%。",
      src: "摩洛哥 · 4.2.3 预提税" },
    { c: "摩洛哥", q: "摩洛哥分公司利润汇出需缴纳的汇出税为？根据中摩税收协定可降至？",
      opts: ["10%；协定下可降至5%", "11.25%；协定下可降至10%", "15%；不可降低", "20%；协定下可降至10%"], a: 0,
      exp: "分公司利润汇出需缴纳10%汇出税，根据中摩税收协定可降至5%；子公司股息汇出则按11.25%（2026年）/10%（2027年起）预提税。",
      src: "摩洛哥 · 4.3.2 实际操作中的要点" },
    { c: "摩洛哥", q: "外派员工在摩洛哥停留多久会构成当地税收居民（需就全球所得申报个税）？",
      opts: ["连续停留超过90天", "任意365天内连续或累计停留超过183天", "连续停留超过6个月自然月", "累计停留超过1年"], a: 1,
      exp: "任意365天内在摩洛哥连续或累计停留超过183天即构成税收居民，需就全球所得在摩洛哥申报个税；不超过183天且雇主非摩洛哥居民企业时，按中摩协定可仅在原籍国纳税。",
      src: "摩洛哥 · 4.2.4 个人所得税与社保" },
    { c: "摩洛哥", q: "2026年摩洛哥 CNSS 社保的雇主缴费率为？",
      opts: ["6.74%", "10%", "21.09%", "27.83%"], a: 2,
      exp: "2026年 CNSS 缴费率为雇主21.09%、雇员6.74%（合计27.83%），存在工资封顶（约6,000 MAD/月），雇主负责代扣雇员部分并统一申报。27.83%是合计数，别选。",
      src: "摩洛哥 · 4.2.4 个人所得税与社保" },
    { c: "摩洛哥", q: "关于摩洛哥的外汇管理，以下说法正确的是？",
      opts: ["摩洛哥居民可自由开设个人外汇账户", "摩洛哥居民不能开设个人外汇账户、不能持有外汇现金，出口所得外汇需出售给中央银行", "外国企业资金入账后可保留外币，无需结汇", "摩洛哥迪拉姆可自由兑换"], a: 1,
      exp: "摩洛哥属外汇管制国家，迪拉姆不可自由兑换：居民不能开个人外汇账户、不能持有外汇现金，出口所得外汇须出售给央行。外国企业可建外汇账户，但入账后即自动兑换成迪拉姆，提汇时需向银行购买。",
      src: "摩洛哥 · 4.3 外汇及资金管制政策 / 4.3.1" },
    { c: "摩洛哥", q: "外国投资者在摩洛哥的投资，资本汇回本国的最短保留期限要求是？",
      opts: ["至少保留1年", "至少保留2年", "至少保留5年", "无保留期要求"], a: 1,
      exp: "外国投资者在摩洛哥的投资至少需保留两年才能将资本汇回本国（子公司解散清算时亦同）。",
      src: "摩洛哥 · 4.3.1 资金汇入汇出路径 / 5.3.3" },
    { c: "摩洛哥", q: "在摩洛哥持有投资超过10年的居民外国投资者，每年可汇出的投资收益上限是？",
      opts: ["50万 MAD", "100万 MAD", "200万 MAD", "500万 MAD"], a: 2,
      exp: "持有投资超过10年的，每年可汇出最高200万 MAD（约合18.5万欧元）投资收益，即便无法提供外汇出资的原始证明。",
      src: "摩洛哥 · 4.3.1 资金汇入汇出路径" },
    { c: "摩洛哥", q: "摩洛哥利润汇回申请获批后，银行购汇和跨境汇款通常的到账时间为？",
      opts: ["当天到账（T+0）", "T+1", "T+2至T+5个工作日", "T+10以上"], a: 2,
      exp: "向外管局（Office des Changes）提交汇出申请，获批后向银行发起购汇和跨境汇款指令，通常 T+2至T+5 个工作日到账。",
      src: "摩洛哥 · 4.3.2 实际操作中的要点" },
    { c: "摩洛哥", q: "在摩洛哥设立有限责任公司（SARL）的最低注册资本要求是？",
      opts: ["10万迪拉姆", "30万迪拉姆", "50万迪拉姆", "100万迪拉姆"], a: 0,
      exp: "SARL 最低注册资本10万迪拉姆；股份有限公司（SA）为30万迪拉姆且股东不少于5人。子公司注册资本须实缴，通过国际银行转账完成并取得银行资金到位证明。",
      src: "摩洛哥 · 5.1.3 资金管理准备" },
    { c: "摩洛哥", q: "摩洛哥银行网银付款复核的短信验证码只能发送至当地运营商号码，实务中的解决方式是？",
      opts: ["无法解决，只能在当地完成全部付款操作", "将当地运营商（如 ORANGE）号码的 SIM 卡带回国内安装使用", "改用邮件验证码", "由银行柜面代为接收"], a: 1,
      exp: "网银付款复核验证码只能当地运营商（如 ORANGE）号码收取，需要国内接收时，要把当地运营商号码 SIM 卡带回国内安装使用——这是账户权限设计的实操细节。",
      src: "摩洛哥 · 5.1.3 资金管理准备" }
  ];

  /* ---------------- 工具 ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------------- 状态 ---------------- */
  var overlay, state = null;

  function pickQuestions(scope) {
    var pool = scope === "全部" ? QUIZ_BANK : QUIZ_BANK.filter(function (x) { return x.c === scope; });
    pool = shuffle(pool);
    var n = scope === "全部" ? 10 : Math.min(pool.length, 10);
    return pool.slice(0, n);
  }

  var GRADES = [
    { min: 0.9, t: "🏆 优秀", d: "对指南核心条款掌握扎实，关键数字与红线要求已过关。" },
    { min: 0.7, t: "👍 良好", d: "大体掌握，个别数字/流程易混淆，建议看看错题解析。" },
    { min: 0.6, t: "😆 及格", d: "基础有了，关键红线条款还需巩固，建议错题对应章节回炉。" },
    { min: -1,  t: "📌 需加强", d: "建议系统阅读指南对应章节后，再测一轮。" }
  ];

  /* ---------------- DOM 构建 ---------------- */
  function ensureDom() {
    if (overlay) return;
    var css = document.createElement("style");
    css.textContent = [
      ".zdq-mask{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(2px)}",
      ".zdq-panel{background:var(--card);color:var(--text,#1f2937);border:1px solid var(--border);border-radius:16px;width:100%;max-width:680px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.25);overflow:hidden}",
      ".zdq-head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border);flex:0 0 auto}",
      ".zdq-head .zdq-title{font-weight:700;font-size:16px;color:var(--primary-dark)}",
      ".zdq-close{border:none;background:none;font-size:20px;cursor:pointer;color:#9ca3af;line-height:1;padding:4px}",
      ".zdq-close:hover{color:#ef4444}",
      ".zdq-body{padding:18px;overflow-y:auto;flex:1 1 auto}",
      ".zdq-scope{display:flex;gap:10px;margin:14px 0 6px}",
      ".zdq-scope button{flex:1;padding:12px 8px;border:1.5px solid var(--border);background:var(--bg,#fff);border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:var(--text,#1f2937);transition:all .15s}",
      ".zdq-scope button:hover{border-color:var(--primary);color:var(--primary-dark);background:var(--primary-light)}",
      ".zdq-meta{font-size:13px;color:#6b7280;line-height:1.8;margin-top:10px}",
      ".zdq-prog{height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:14px}",
      ".zdq-prog i{display:block;height:100%;background:var(--primary);border-radius:3px;transition:width .25s}",
      ".zdq-cnum{font-size:12px;color:#6b7280;margin-bottom:6px}",
      ".zdq-q{font-size:16px;font-weight:600;line-height:1.6;margin-bottom:14px;color:var(--text,#1f2937)}",
      ".zdq-opt{display:block;width:100%;text-align:left;padding:12px 14px;margin-bottom:10px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg,#fff);cursor:pointer;font-size:14px;line-height:1.5;color:var(--text,#1f2937);transition:all .12s}",
      ".zdq-opt:hover{border-color:var(--primary);background:var(--primary-light)}",
      ".zdq-opt .zl{display:inline-block;width:22px;height:22px;border-radius:50%;border:1px solid var(--border);text-align:center;line-height:20px;font-size:12px;margin-right:8px;font-weight:700}",
      ".zdq-opt.zd-on{border-color:var(--primary);background:var(--primary-light)}",
      ".zdq-opt.zd-ok{border-color:#16a34a;background:#f0fdf4}",
      ".zdq-opt.zd-ok .zl{background:#16a34a;border-color:#16a34a;color:#fff}",
      ".zdq-opt.zd-bad{border-color:#dc2626;background:#fef2f2}",
      ".zdq-opt.zd-bad .zl{background:#dc2626;border-color:#dc2626;color:#fff}",
      ".zdq-opt:disabled{cursor:default;opacity:.92}",
      ".zdq-expl{border-left:3px solid var(--primary);background:var(--primary-light);border-radius:0 8px 8px 0;padding:10px 12px;font-size:13px;line-height:1.7;margin:12px 0;color:var(--text,#374151)}",
      ".zdq-expl .zdq-src{display:block;margin-top:6px;font-size:12px;color:#6b7280}",
      ".zdq-foot{display:flex;justify-content:space-between;align-items:center;padding:12px 18px;border-top:1px solid var(--border);flex:0 0 auto}",
      ".zdq-btn{padding:9px 20px;border:none;border-radius:8px;background:var(--primary);color:#fff;font-size:14px;font-weight:600;cursor:pointer}",
      ".zdq-btn:hover{background:var(--primary-dark)}",
      ".zdq-btn:disabled{opacity:.4;cursor:default}",
      ".zdq-btn.ghost{background:transparent;color:var(--primary-dark);border:1px solid var(--border)}",
      ".zdq-score{text-align:center;padding:8px 0 14px}",
      ".zdq-score .num{font-size:52px;font-weight:800;color:var(--primary-dark);line-height:1.2}",
      ".zdq-score .num small{font-size:22px;font-weight:600;color:#9ca3af}",
      ".zdq-score .gd{font-size:18px;font-weight:700;margin:6px 0 4px;color:var(--text,#1f2937)}",
      ".zdq-score .desc{font-size:13px;color:#6b7280}",
      ".zdq-wrong-title{font-size:14px;font-weight:700;margin:16px 0 8px;color:var(--text,#1f2937)}",
      ".zdq-wrong{border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:10px;background:var(--bg,#fff)}",
      ".zdq-wrong .wq{font-size:13px;font-weight:600;line-height:1.6;margin-bottom:6px;color:var(--text,#1f2937)}",
      ".zdq-wrong .wa{font-size:12.5px;line-height:1.8;color:#6b7280}",
      ".zdq-wrong .wa b{color:#dc2626;font-weight:600}",
      ".zdq-wrong .wa i{color:#16a34a;font-style:normal;font-weight:600}",
      ".zdq-mini{font-size:12px;color:#9ca3af;text-align:center;margin-top:10px}"
    ].join("");
    document.head.appendChild(css);

    overlay = document.createElement("div");
    overlay.className = "zdq-mask";
    overlay.style.display = "none";
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.body.appendChild(overlay);
  }

  function close() {
    if (overlay) overlay.style.display = "none";
    state = null;
  }

  function panel(html) {
    overlay.innerHTML =
      '<div class="zdq-panel">' +
        '<div class="zdq-head">' +
          '<span class="zdq-title">📝 员工自测 · 境外财务管理</span>' +
          '<button class="zdq-close" title="关闭">×</button>' +
        '</div>' +
        '<div class="zdq-body">' + html + '</div>' +
      '</div>';
    var c = overlay.querySelector(".zdq-close");
    if (c) c.addEventListener("click", close);
    return overlay.querySelector(".zdq-body");
  }

  /* ---------------- 页面：选范围 ---------------- */
  function renderHome() {
    state = { scope: null };
    var body = panel(
      '<p style="font-size:14px;line-height:1.8;margin:0 0 4px">题库出自《境外财务管理操作指南》（阿联酋 / 摩洛哥）真实条文，涵盖<b>税收制度、外汇资金、劳工合规</b>等红线知识点。每题作答后即时显示对错与条文解析。</p>' +
      '<div class="zdq-scope">' +
        '<button data-s="全部">🌐 综合 10 题</button>' +
        '<button data-s="阿联酋">🇦🇪 阿联酋专项</button>' +
        '<button data-s="摩洛哥">🇲🇦 摩洛哥专项</button>' +
      '</div>' +
      '<div class="zdq-meta">· 每轮随机抽题，可反复测试<br>· 解析均标注指南章节出处，可对照原文核查</div>'
    );
    body.querySelectorAll(".zdq-scope button").forEach(function (b) {
      b.addEventListener("click", function () { startQuiz(b.getAttribute("data-s")); });
    });
    overlay.style.display = "flex";
  }

  /* ---------------- 页面：答题 ---------------- */
  function startQuiz(scope) {
    var qs = pickQuestions(scope);
    state = { scope: scope, qs: qs, idx: 0, ans: [], right: 0 };
    renderQuestion();
  }

  function renderQuestion() {
    var s = state, q = s.qs[s.idx];
    var body = panel(
      '<div class="zdq-prog"><i style="width:' + (s.idx / s.qs.length * 100) + '%"></i></div>' +
      '<div class="zdq-cnum">第 ' + (s.idx + 1) + ' / ' + s.qs.length + ' 题 · ' + q.c + '篇</div>' +
      '<div class="zdq-q">' + q.q + '</div>' +
      '<div class="zdq-opts">' +
        q.opts.map(function (o, i) {
          return '<button class="zdq-opt" data-i="' + i + '"><span class="zl">' + "ABCD"[i] + '</span>' + o + '</button>';
        }).join("") +
      '</div>' +
      '<div class="zdq-expl-wrap"></div>' +
      '<div class="zdq-foot2" style="margin-top:12px;text-align:right"><button class="zdq-btn" id="zdqNext" disabled>' + (s.idx === s.qs.length - 1 ? "查看成绩" : "下一题 →") + '</button></div>'
    );
    var opts = body.querySelectorAll(".zdq-opt");
    opts.forEach(function (b) {
      b.addEventListener("click", function () { answer(parseInt(b.getAttribute("data-i"), 10)); });
    });
    var next = body.querySelector("#zdqNext");
    next.addEventListener("click", function () {
      if (s.idx === s.qs.length - 1) renderResult();
      else { s.idx++; renderQuestion(); }
    });

    function answer(i) {
      opts.forEach(function (b) { b.disabled = true; });
      var ok = i === q.a;
      s.ans.push(i);
      if (ok) s.right++;
      opts[q.a].classList.add("zd-ok");
      if (!ok) opts[i].classList.add("zd-bad");
      else opts[i].classList.add("zd-on");
      var w = body.querySelector(".zdq-expl-wrap");
      w.innerHTML =
        '<div class="zdq-expl">' +
          (ok ? "✅ <b>回答正确。</b>" : "❌ <b>回答错误。</b>正确答案：" + "ABCD"[q.a] + "。") +
          q.exp +
          '<span class="zdq-src">📎 依据：' + q.src + '</span>' +
        '</div>';
      next.disabled = false;
    }
  }

  /* ---------------- 页面：成绩 ---------------- */
  function renderResult() {
    var s = state, total = s.qs.length, pct = s.right / total;
    var g = GRADES[GRADES.length - 1];
    for (var i = 0; i < GRADES.length; i++) { if (pct >= GRADES[i].min) { g = GRADES[i]; break; } }
    var wrongs = [];
    s.qs.forEach(function (q, i) {
      if (s.ans[i] === q.a) return;
      wrongs.push(
        '<div class="zdq-wrong">' +
          '<div class="wq">' + (i + 1) + '. ' + q.q + '</div>' +
          '<div class="wa">你的答案：<b>' + (s.ans[i] == null ? "未作答" : "ABCD"[s.ans[i]] + " " + q.opts[s.ans[i]]) + '</b><br>' +
          '正确答案：<i>' + "ABCD"[q.a] + " " + q.opts[q.a] + '</i><br>' +
          q.exp + '<br><span style="color:#9ca3af">📎 ' + q.src + '</span></div>' +
        '</div>'
      );
    });
    var body = panel(
      '<div class="zdq-score">' +
        '<div class="num">' + s.right + '<small> / ' + total + '</small></div>' +
        '<div class="gd">' + g.t + '</div>' +
        '<div class="desc">' + g.d + '</div>' +
      '</div>' +
      (wrongs.length
        ? '<div class="zdq-wrong-title">📋 错题回顾（' + wrongs.length + ' 题）</div>' + wrongs.join("")
        : '<div class="zdq-wrong-title">🎉 全部答对，无错题！</div>') +
      '<div class="zdq-mini">题库依据《境外财务管理操作指南》V1.0 · 2026年7月发布</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:14px">' +
        '<button class="zdq-btn ghost" id="zdqAgain">🔄 再测一轮</button>' +
        '<button class="zdq-btn" id="zdqDone">完成</button>' +
      '</div>'
    );
    body.querySelector("#zdqAgain").addEventListener("click", renderHome);
    body.querySelector("#zdqDone").addEventListener("click", close);
  }

  /* ---------------- 接线 ---------------- */
  function open() { ensureDom(); renderHome(); }

  if (typeof window !== "undefined") {
    window.ZDQuiz = { open: open, bankSize: QUIZ_BANK.length };
  }
  if (typeof document !== "undefined") {
    var boot = function () {
      var btn = document.getElementById("quizBtn");
      if (btn) btn.addEventListener("click", open);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
  }
})();
