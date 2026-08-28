/* ============================================================
 * zhidu-qa 问答分享卡片
 * 把一条问答（问题 + 要点卡/正文 + 来源）渲染成 PNG 下载
 * 原理：拼 SVG → 画进 canvas（嵌入 logo 图像）→ toBlob 下载
 * 用法：<script src="share-card.js" defer></script>
 *      window.makeShareCard({ q, answer, sources, theme })
 * ============================================================ */
(function () {
  "use strict";

  var THEME_PALETTE = {
    basic:   { bg: "#f7f9fb", ink: "#1f2937", sub: "#6b7280", accent: "#5b8db8", card: "#ffffff", border: "#e5e7eb", decor: "rgba(91,141,184,.10)" },
    guochao: { bg: "#f8f3e8", ink: "#33291f", sub: "#8a7d68", accent: "#9e3b2c", card: "#fffdf8", border: "#e4dac4", decor: "rgba(158,59,44,.07)" },
    tech:    { bg: "#0b1220", ink: "#e5e7eb", sub: "#8b98ad", accent: "#22d3ee", card: "#1e2942", border: "#243148", decor: "rgba(34,211,238,.08)" }
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* 文本按宽度截断成多行（估算中文字宽） */
  function wrapText(text, maxChars) {
    var lines = [];
    String(text || "").split(/\n+/).forEach(function (para) {
      var cur = "";
      for (var i = 0; i < para.length; i++) {
        cur += para[i];
        if (cur.length >= maxChars) { lines.push(cur); cur = ""; }
      }
      if (cur) lines.push(cur);
    });
    return lines;
  }

  /* 剥掉 markdown 轻标记，只留纯文本 */
  function plainBody(md) {
    return String(md || "")
     .replace(/^#{1,3}\s+/gm, "")
     .replace(/^\s*[-*]\s+/gm, "· ")
     .replace(/\*\*(.+?)\*\*/g, "$1")
     .replace(/`(.+?)`/g, "$1")
      .trim();
  }

  /* ---------- 组装 SVG 卡片 ---------- */
  function buildCardSVG(opts) {
    var p = THEME_PALETTE[opts.theme] || THEME_PALETTE.basic;
    var W = 900;
    var date = new Date();
    var dateStr = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();

    var qLines = wrapText(opts.q, 26).slice(0, 3);
    var bodyLines = [];
    plainBody(opts.answer).split(/\n/).forEach(function (l) {
      if (bodyLines.length > 16) return;
      wrapText(l, 30).slice(0, 3).forEach(function (wl) { bodyLines.push(wl); });
    });
    bodyLines = bodyLines.slice(0, 16);

    var H = 210 + qLines.length * 40 + bodyLines.length * 34 + (opts.sources && opts.sources.length ? 60 : 0) + 90;

    var sb = [];
    sb.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">');
    sb.push('<rect width="' + W + '" height="' + H + '" fill="' + p.bg + '"/>');
    /* 顶部色带 + 角部装饰 */
    sb.push('<rect width="' + W + '" height="10" fill="' + p.accent + '"/>');
    sb.push('<circle cx="' + (W - 70) + '" cy="90" r="140" fill="' + p.decor + '"/>');
    sb.push('<circle cx="60" cy="' + (H - 40) + '" r="110" fill="' + p.decor + '"/>');

    /* 品牌行 */
    sb.push('<text x="60" y="72" font-size="22" fill="' + p.accent + '" font-weight="bold" font-family="Microsoft YaHei,sans-serif">境外财务管理操作指南 · 智能问答</text>');
    sb.push('<text x="' + (W - 60) + '" y="72" font-size="18" fill="' + p.sub + '" text-anchor="end" font-family="Microsoft YaHei,sans-serif">' + dateStr + '</text>');
    sb.push('<line x1="60" y1="92" x2="' + (W - 60) + '" y2="92" stroke="' + p.border + '" stroke-width="2"/>');

    /* 问题区 */
    var y = 140;
    qLines.forEach(function (l, i) {
      sb.push('<text x="60" y="' + y + '" font-size="28" fill="' + p.ink + '" font-weight="bold" font-family="Microsoft YaHei,sans-serif">' + (i === 0 ? "问：\u3000" : "\u3000\u3000") + esc(l) + '</text>');
      y += 40;
    });
    y += 18;

    /* 答案区（卡片底） */
    var cardTop = y - 30;
    var cardH = bodyLines.length * 34 + (opts.sources && opts.sources.length ? 66 : 16) + 30;
    sb.push('<rect x="40" y="' + cardTop + '" width="' + (W - 80) + '" height="' + cardH + '" rx="14" fill="' + p.card + '" stroke="' + p.border + '" stroke-width="1"/>');
    y = cardTop + 46;
    bodyLines.forEach(function (l) {
      sb.push('<text x="70" y="' + y + '" font-size="21" fill="' + p.ink + '" font-family="Microsoft YaHei,sans-serif">' + esc(l) + '</text>');
      y += 34;
    });

    /* 来源区 */
    if (opts.sources && opts.sources.length) {
      y += 12;
      sb.push('<line x1="70" y1="' + (y - 18) + '" x2="' + (W - 70) + '" y2="' + (y - 18) + '" stroke="' + p.border + '" stroke-dasharray="4 4"/>');
      sb.push('<text x="70" y="' + y + '" font-size="17" fill="' + p.sub + '" font-family="Microsoft YaHei,sans-serif">📎 依据：' + esc(opts.sources.slice(0, 3).join(" | ")) + '</text>');
    }

    /* 底部落款 */
    var fy = H - 34;
    sb.push('<text x="60" y="' + fy + '" font-size="16" fill="' + p.sub + '" font-family="Microsoft YaHei,sans-serif">中国海诚工程科技股份有限公司 · 财务资金管理中心</text>');
    sb.push('<text x="' + (W - 60) + '" y="' + fy + '" font-size="16" fill="' + p.sub + '" text-anchor="end" font-family="Microsoft YaHei,sans-serif">回答由 AI 生成，请以正式制度文件为准</text>');
    sb.push('</svg>');
    return { svg: sb.join(""), width: W, height: H };
  }

  /* 把 logo 图转成 dataURL（读取失败就不嵌图） */
  function logoDataUrl() {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        try {
          var c = document.createElement("canvas");
          c.width = img.naturalWidth; c.height = img.naturalHeight;
          c.getContext("2d").drawImage(img, 0, 0);
          resolve(c.toDataURL("image/png"));
        } catch (e) { resolve(null); }
      };
      img.onerror = function () { resolve(null); };
      img.src = "logo.png";
    });
  }

  /* SVG → PNG dataURL（经 Image 中转，logo 以 <image> 嵌入） */
  function svgToPng(svgText, w, h, logoUrl) {
    return new Promise(function (resolve, reject) {
      varDataUrl(logoUrl).then(function (logoData) {
        var withLogo = svgText;
        if (logoData) {
          withLogo = withLogo.replace('<rect x="40"',
            '<image x="52" y="34" width="42" height="42" href="' + logoData + '"/><rect x="40" y="96"');
        }
        var blob = new Blob([withLogo], { type: "image/svg+xml;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var img = new Image();
        img.onload = function () {
          var c = document.createElement("canvas");
          var scale = 2; /* 2x 高清 */
          c.width = w * scale; c.height = h * scale;
          var ctx = c.getContext("2d");
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0, w, h);
          URL.revokeObjectURL(url);
          try { resolve(c.toDataURL("image/png")); }
          catch (e) { reject(e); }
        };
        img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("svg render failed")); };
        img.src = url;
      });
    });
  }

  function varDataUrl(u) {
    return new Promise(function (resolve) {
      if (!u) return resolve(null);
      var img = new Image();
      img.onload = function () {
        try {
          var c = document.createElement("canvas");
          c.width = img.naturalWidth; c.height = img.naturalHeight;
          c.getContext("2d").drawImage(img, 0, 0);
          resolve(c.toDataURL("image/png"));
        } catch (e) { resolve(null); }
      };
      img.onerror = function () { resolve(null); };
      img.src = u;
    });
  }

  /* ---------- 对外入口：生成并下载 ---------- */
  function makeShareCard(opts) {
    var built = buildCardSVG(opts);
    var logo = (location.protocol === "file:" || location.protocol === "https:") ? null : null;
    return svgToPng(built.svg, built.width, built.height, logo).then(function (dataUrl) {
      var a = document.createElement("a");
      a.href = dataUrl;
      a.download = "问答分享卡-" + String(opts.q || "").slice(0, 12).replace(/[\\/:*?"<>|]/g, "") + ".png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return true;
    });
  }

  /* ---------- 工具行按钮接线 ---------- */
  function init() {
    if (!window.__zdHookShareCard) return;
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".share-card-btn");
      if (!btn) return;
      e.preventDefault();
      var payload;
      try { payload = JSON.parse(btn.dataset.card || "{}"); } catch (err) { payload = {}; }
      btn.textContent = "⏳ 生成中";
      makeShareCard(payload).then(function () {
        btn.textContent = "✅ 已下载";
        setTimeout(function () { btn.textContent = "🖼 分享卡"; }, 1800);
      }).catch(function () {
        btn.textContent = "❌ 生成失败";
        setTimeout(function () { btn.textContent = "🖼 分享卡"; }, 1800);
      });
    });
  }

  window.makeShareCard = makeShareCard;
  window.buildCardSVG = buildCardSVG; /* 自测用 */

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})();
