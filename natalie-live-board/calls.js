/* Nat call deck. One card per lead. Data = calls.json only. */
(function () {
  "use strict";
  var KEY = "nat-calls-v1:";
  var CSS = [
    ".nd{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:#070504;color:#f6efe4;font-family:Figtree,'Segoe UI',system-ui,sans-serif;font-size:16px;line-height:1.45;-webkit-text-size-adjust:100%}",
    ".nd *{box-sizing:border-box}",
    ".nd-bar{height:3px;background:#2a2118;flex:0 0 3px}",
    ".nd-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#8a6230,#e8b84a);transition:width .25s ease}",
    ".nd-top{display:flex;align-items:center;gap:6px;padding:calc(8px + env(safe-area-inset-top)) 10px 8px;background:#0c0907;border-bottom:1px solid #2a2118}",
    ".nd-top button{font:inherit;font-weight:700;border:0;border-radius:999px;padding:8px 12px;background:transparent;color:#c4b3a0;cursor:pointer;min-height:40px}",
    ".nd-top .nd-close{color:#f6efe4;padding-left:4px}",
    ".nd-count{flex:1;text-align:center;font-size:15px;font-weight:750;letter-spacing:.02em;color:#f6efe4;min-width:0}",
    ".nd-count small{display:block;margin-top:1px;font-size:11px;font-weight:650;color:#a08b76;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nd-arrows{display:flex;gap:4px}",
    ".nd-arrows button{width:40px;height:40px;padding:0;border:1px solid #3a2e24;background:#16110d;color:#f6efe4;border-radius:12px;font-size:20px;line-height:1}",
    ".nd-arrows button:disabled{opacity:.28}",
    ".nd-body{flex:1;min-height:0;display:flex}",
    ".nd-rail{display:none}",
    ".nd-stage{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column}",
    ".nd-track{flex:1;min-height:0;display:flex;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;scrollbar-width:none}",
    ".nd-track::-webkit-scrollbar{display:none}",
    ".nd-slide{flex:0 0 100%;width:100%;height:100%;scroll-snap-align:start;scroll-snap-stop:always;padding:14px 14px calc(18px + env(safe-area-inset-bottom))}",
    ".nd-card{height:100%;overflow-y:auto;background:#120e0b;border:1px solid #3a2e24;border-radius:22px;padding:18px 16px 28px;overscroll-behavior-y:contain;box-shadow:0 18px 50px rgba(0,0,0,.35)}",
    ".nd-card.called{box-shadow:inset 3px 0 0 #e8b84a, 0 18px 50px rgba(0,0,0,.35)}",
    ".nd-kicker{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin:0}",
    ".nd-rank{font-family:Fraunces,Georgia,serif;font-size:28px;font-weight:560;letter-spacing:.04em;color:#e8b84a;line-height:1}",
    ".nd-days{font-size:13px;font-weight:700;color:#a08b76;text-align:right}",
    ".nd-days b{display:block;color:#f6efe4;font-family:Fraunces,Georgia,serif;font-size:22px;font-weight:560;line-height:1}",
    ".nd h2{font-family:Fraunces,'Iowan Old Style',Georgia,serif;font-size:34px;line-height:1.02;font-weight:560;margin:10px 0 0;color:#f6efe4;letter-spacing:-.01em}",
    ".nd-town{margin:4px 0 0;color:#a08b76;font-size:15px}",
    ".nd-ask{margin:12px 0 0;font-size:17px;color:#f6efe4}",
    ".nd-ask b{font-weight:750}",
    ".nd-touch{margin:4px 0 0;color:#a08b76;font-size:13px;font-weight:650}",
    ".nd-flags{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0 0}",
    ".nd-pill{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;border-radius:999px;padding:5px 9px}",
    ".nd-pill.hold{background:#3a1614;color:#ffb4a8}",
    ".nd-pill.wait{background:#3a2a12;color:#ffd76a}",
    ".nd-pill.emailed{background:#1a2433;color:#c5d7f2}",
    ".nd-pill.far{background:#2a2420;color:#d2c3b2}",
    ".nd-banner{margin:12px 0 0;padding:11px 12px;border-radius:12px;font-weight:750;font-size:14px;line-height:1.35}",
    ".nd-banner.hold{background:#3a1614;color:#ffd0c8}",
    ".nd-banner.fee{background:#3a2a12;color:#ffe3a3}",
    ".nd-call{display:flex;flex-direction:column;align-items:center;justify-content:center;text-decoration:none;background:#e8b84a;color:#1a120c;border-radius:16px;padding:14px 16px;margin:16px 0 0;text-align:center;min-height:76px}",
    ".nd-call .n{display:block;font-family:Fraunces,Georgia,serif;font-size:30px;font-weight:560;letter-spacing:.01em;line-height:1}",
    ".nd-call .l{display:block;margin-top:5px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}",
    ".nd-card.hold .nd-call{background:#8d7764;color:#1a120c}",
    ".nd-more{display:flex;flex-direction:column;gap:0;margin-top:4px}",
    ".nd-more a{display:flex;align-items:center;justify-content:space-between;text-decoration:none;color:#f6efe4;padding:12px 2px;border-bottom:1px solid #2a2118;font-weight:750;font-size:16px}",
    ".nd-more a span{color:#a08b76;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase}",
    ".nd-nophone{margin:16px 0 0;padding:14px;border-radius:14px;background:#1c1510;color:#c4b3a0;text-align:center;font-weight:700}",
    ".nd-block{margin:18px 0 0}",
    ".nd-block h3{margin:0 0 6px;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#a08b76}",
    ".nd-block p{margin:0;font-size:16.5px;line-height:1.45;color:#f6efe4}",
    ".nd-block.why{background:#24180f;border-radius:16px;padding:14px 14px 15px;border:1px solid #5c4124}",
    ".nd-block.why h3{color:#e8b84a}",
    ".nd-block.said{padding-top:2px}",
    ".nd-block.said p{color:#f3eadf}",
    ".nd-warn{margin:12px 0 0;padding:10px 12px;border-radius:12px;background:#1c1612;color:#f0d7a4;font-size:14px;font-weight:650;line-height:1.4;border:1px solid #3a2e24}",
    ".nd-acts{display:flex;gap:8px;margin-top:18px}",
    ".nd-acts a,.nd-acts button{flex:1;text-align:center;text-decoration:none;font:inherit;font-size:14px;font-weight:750;border-radius:12px;padding:12px 8px;cursor:pointer;border:1px solid #3a2e24;background:#1c1510;color:#f6efe4;min-height:44px}",
    ".nd-mark{display:block;width:100%;font:inherit;font-size:16px;font-weight:800;border:1px solid #e8b84a;background:transparent;color:#e8b84a;border-radius:14px;padding:13px;margin:16px 0 0;cursor:pointer;min-height:48px}",
    ".nd-card.called .nd-mark{background:#e8b84a;color:#1a120c}",
    ".nd-lbl{display:block;margin:18px 0 6px;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#a08b76}",
    ".nd-notes{display:block;width:100%;min-height:88px;font:inherit;font-size:16px;border:1px solid #3a2e24;border-radius:14px;padding:12px;resize:vertical;background:#0c0907;color:#f6efe4}",
    ".nd-saverow{display:flex;align-items:center;gap:12px;margin-top:8px}",
    ".nd-save{background:#e8b84a;color:#1a120c;border:0;border-radius:12px;padding:10px 16px;font:inherit;font-size:15px;font-weight:800;cursor:pointer;min-height:44px}",
    ".nd-saved{font-size:13px;color:#a08b76;font-weight:650}",
    ".nd-intro h1{font-family:Fraunces,Georgia,serif;font-size:42px;line-height:1;font-weight:560;margin:6px 0 6px;color:#f6efe4}",
    ".nd-intro .lede{margin:0;color:#a08b76;font-size:15px}",
    ".nd-nights{display:flex;flex-direction:column;margin-top:4px}",
    ".nd-night{display:flex;gap:12px;align-items:baseline;padding:9px 0;border-bottom:1px solid #2a2118}",
    ".nd-night b{flex:0 0 42px;color:#e8b84a;font-size:12px;letter-spacing:.12em;text-transform:uppercase}",
    ".nd-night span{color:#f6efe4;font-size:15px}",
    ".nd-rules{margin:4px 0 0;padding:0;list-style:none}",
    ".nd-rules li{padding:9px 0 9px 14px;border-bottom:1px solid #2a2118;color:#f6efe4;position:relative}",
    ".nd-rules li:before{content:'';position:absolute;left:0;top:16px;width:6px;height:6px;border-radius:50%;background:#e8b84a}",
    ".nd-go{display:block;width:100%;margin-top:18px;border:0;border-radius:14px;background:#e8b84a;color:#1a120c;font:inherit;font-weight:800;font-size:16px;padding:15px;cursor:pointer;min-height:52px}",
    ".nd-prog{margin:14px 0 0;color:#a08b76;font-size:13px;font-weight:650}",
    ".nd-jump{position:absolute;inset:0;z-index:5;background:rgba(0,0,0,.55);display:none}",
    ".nd-jump.on{display:block}",
    ".nd-jump-box{position:absolute;left:12px;right:12px;top:calc(12px + env(safe-area-inset-top));bottom:calc(12px + env(safe-area-inset-bottom));background:#100c0a;border:1px solid #3a2e24;border-radius:22px;display:flex;flex-direction:column;overflow:hidden}",
    ".nd-jump-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid #2a2118;font-size:16px;font-weight:750}",
    ".nd-jump-head button{font:inherit;font-weight:800;border:0;border-radius:999px;padding:8px 14px;background:#e8b84a;color:#1a120c;min-height:40px}",
    ".nd-jump-list{overflow-y:auto;padding:4px 6px 16px}",
    ".nd-jump-list button{display:grid;grid-template-columns:32px 1fr auto;gap:8px;align-items:center;width:100%;text-align:left;font:inherit;font-size:15px;border:0;background:none;border-bottom:1px solid #241c16;padding:12px 8px;color:#f6efe4;cursor:pointer;min-height:52px}",
    ".nd-jump-list button.cur,.nd-jump-list button.on{background:#24180f;border-radius:12px}",
    ".nd-jump-list .r{color:#e8b84a;font-family:Fraunces,Georgia,serif;font-size:18px}",
    ".nd-jump-list .nm{display:block;font-weight:750}",
    ".nd-jump-list .tw{display:block;color:#a08b76;font-size:12px;font-weight:650}",
    ".nd-dot{width:7px;height:7px;border-radius:50%;display:inline-block;margin-left:5px;vertical-align:middle}",
    ".nd-dot.hold{background:#ff7a6e}.nd-dot.wait{background:#ffb45a}.nd-dot.emailed{background:#8eb4ea}.nd-dot.far{background:#a08b76}",
    ".nd-tick{color:#e8b84a;font-weight:800}",
    "#calls{display:none}#calls.show{display:block}#calls.suspended,#calls.suspended *{visibility:hidden!important;pointer-events:none!important}",
    "#calls-btn{background:#e8b84a!important;color:#1a120c!important;border-radius:999px;padding:8px 14px;font-weight:800;font-size:14px;min-height:40px}",
    "@media (min-width:960px){",
    ".nd-rail{display:flex;flex-direction:column;width:300px;flex:0 0 300px;border-right:1px solid #2a2118;background:#0c0907;overflow:auto}",
    ".nd-rail h3{margin:0;padding:18px 16px 8px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#a08b76}",
    ".nd-rail button{display:grid;grid-template-columns:28px 1fr auto;gap:8px;align-items:center;width:100%;text-align:left;font:inherit;border:0;border-bottom:1px solid #241c16;background:transparent;color:#f6efe4;padding:12px 14px;cursor:pointer;min-height:52px}",
    ".nd-rail button.on{background:#24180f;box-shadow:inset 3px 0 0 #e8b84a}",
    ".nd-rail .r{color:#e8b84a;font-family:Fraunces,Georgia,serif;font-size:16px}",
    ".nd-rail .nm{display:block;font-weight:700;font-size:14px}",
    ".nd-rail .tw{display:block;color:#a08b76;font-size:12px;margin-top:1px}",
    ".nd-rail .dy{color:#e8b84a;font-size:14px;font-weight:800}",
    ".nd-slide{display:flex;justify-content:center;align-items:stretch;padding:28px 32px}",
    ".nd-card{width:min(640px,100%)}",
    ".nd-jump{display:none!important}",
    ".nd-jumpbtn{display:none}",
    "}"
  ].join("\n");

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function store(k, v) {
    try { if (v == null || v === "") localStorage.removeItem(KEY + k); else localStorage.setItem(KEY + k, v); } catch (e) {}
  }
  function load(k) {
    try { return localStorage.getItem(KEY + k) || ""; } catch (e) { return ""; }
  }
  function injectCss() {
    var s = document.getElementById("nd-css");
    if (!s) { s = el("style"); s.id = "nd-css"; document.head.appendChild(s); }
    s.textContent = CSS;
  }
  function extraNote(v) {
    var n = String(v.note || "").trim();
    var i = n.indexOf("\u00b7");
    if (i >= 0) return n.slice(i + 1).trim();
    if (/^Last contact:/i.test(n)) return "";
    return n;
  }
  function extraDays(v) {
    var n = String(v.daysNote || "").trim();
    if (!n || /^since last contact$/i.test(n)) return "";
    return n.replace(/^since last contact\s*\u00b7\s*/i, "");
  }
  function dayCount(v) {
    var dd = v.days;
    var ld = window.ND_LIST_DATE;
    var base = ld ? new Date(ld + "T00:00:00") : null;
    var now0 = new Date(); now0.setHours(0, 0, 0, 0);
    var off = base ? Math.round((now0 - base) / 86400000) : 0;
    if (off > 0 && typeof dd === "string") dd = dd.replace(/\d+/g, function (n) { return String(Number(n) + off); });
    return dd;
  }
  function phonesInOrder(v) {
    return (v.phones || []).slice().sort(function (a, b) {
      function score(p) { return /mob/i.test(p.label || "") ? 0 : 1; }
      return score(a) - score(b);
    });
  }
  function plainLabel(label) {
    var s = String(label || "").toLowerCase();
    if (!s) return "Call";
    if (s.indexOf("directory") >= 0) return "Other line";
    if (s.indexOf("signature") >= 0) return "On her email";
    if (s.indexOf("pub") >= 0) return "Pub line";
    if (s.indexOf("club") >= 0) return "Club line";
    if (s.indexOf("mob") >= 0) return "Mobile";
    if (s.indexOf("web") >= 0) return "Listed number";
    if (s.indexOf("files") >= 0) return "Landline";
    return label;
  }
  function askName(v) {
    var c = String(v.contact || "").trim();
    if (!c || /no name/i.test(c)) return "";
    return c;
  }
  function fmtISO(iso) {
    if (!iso) return "";
    var p = String(iso).split("-");
    if (p.length < 3) return String(iso);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var m = months[Number(p[1]) - 1] || p[1];
    return String(Number(p[2])) + " " + m;
  }
  function touchLine(v) {
    if (!v.lastContact) return "";
    var who = v.lastContactWho === "Us" ? "we wrote" : (v.lastContactWho === "Them" ? "they replied" : "");
    return "Last touch " + fmtISO(v.lastContact) + (who ? " \u00b7 " + who : "");
  }
  function feeLock(v) {
    var blob = String(v.note || "") + " " + String(v.why || "");
    if (/do not restate|fee already agreed|price is agreed|NEVER_AGAIN/i.test(blob)) {
      return "Fee already agreed. Do not say the number again.";
    }
    return "";
  }
  function showWhy(s) {
    return String(s || "").replace(/\s*\(NEVER_AGAIN\s*#?\d+\)/gi, "").replace(/\s{2,}/g, " ").trim();
  }
  function quoteTitle(q) {
    if (/^no fee/i.test(String(q || ""))) return "Price";
    return "Quote already sent";
  }
  function pad2(n) { return n < 10 ? "0" + n : String(n); }
  function block(title, body, cls) {
    var d = el("div", "nd-block" + (cls ? " " + cls : ""));
    d.appendChild(el("h3", null, title));
    d.appendChild(el("p", null, body));
    return d;
  }

  function introCard(data, start) {
    var c = el("div", "nd-card nd-intro");
    c.appendChild(el("p", "nd-rank", data.venues.length + " to call"));
    c.appendChild(el("h1", null, "Tonight"));
    c.appendChild(el("p", "lede", data.title || "Calls, in the order to dial."));
    var s1 = el("div", "nd-block");
    s1.appendChild(el("h3", null, "Free nights"));
    var nights = el("div", "nd-nights");
    (data.freeNights || []).forEach(function (f) {
      var row = el("div", "nd-night");
      row.appendChild(el("b", null, f.month));
      row.appendChild(el("span", null, f.nights));
      nights.appendChild(row);
    });
    s1.appendChild(nights);
    c.appendChild(s1);
    var s2 = el("div", "nd-block");
    s2.appendChild(el("h3", null, "Before you offer a date"));
    var ul = el("ul", "nd-rules");
    (data.rules || []).forEach(function (r) { ul.appendChild(el("li", null, r)); });
    s2.appendChild(ul);
    c.appendChild(s2);
    c.appendChild(el("p", "nd-prog", ""));
    var go = el("button", "nd-go", "Start with number 1");
    go.type = "button";
    go.onclick = function () { if (start) start(); };
    c.appendChild(go);
    return c;
  }

  function venueCard(v, opts) {
    opts = opts || {};
    var c = el("div", "nd-card");
    var isHold = (v.flags || []).some(function (f) { return f.type === "hold"; });
    if (isHold) c.classList.add("hold");
    var kick = el("div", "nd-kicker");
    kick.appendChild(el("span", "nd-rank", pad2(v.rank)));
    var days = el("span", "nd-days");
    days.appendChild(el("b", null, String(dayCount(v))));
    days.appendChild(document.createTextNode("days quiet"));
    kick.appendChild(days);
    c.appendChild(kick);
    c.appendChild(el("h2", null, v.venue));
    if (v.town) c.appendChild(el("p", "nd-town", v.town));
    var who = askName(v);
    if (who) {
      var ask = el("p", "nd-ask");
      ask.appendChild(document.createTextNode("Ask for "));
      ask.appendChild(el("b", null, who));
      c.appendChild(ask);
    }
    var touch = touchLine(v);
    if (touch) c.appendChild(el("p", "nd-touch", touch));
    if (v.flags && v.flags.length) {
      var pills = el("div", "nd-flags");
      v.flags.forEach(function (f) { pills.appendChild(el("span", "nd-pill " + (f.type || ""), f.text)); });
      c.appendChild(pills);
    }
    if (isHold) c.appendChild(el("p", "nd-banner hold", "Jake HOLD. Get his OK before you dial."));
    var fee = feeLock(v);
    if (fee) c.appendChild(el("p", "nd-banner fee", fee));
    var phones = phonesInOrder(v);
    if (phones.length) {
      var main = phones[0];
      var a = el("a", "nd-call");
      a.href = "tel:" + main.tel;
      a.appendChild(el("span", "n", main.number));
      a.appendChild(el("span", "l", plainLabel(main.label) + " \u00b7 tap to call"));
      c.appendChild(a);
      if (phones.length > 1) {
        var more = el("div", "nd-more");
        phones.slice(1).forEach(function (p) {
          var b = el("a");
          b.href = "tel:" + p.tel;
          b.appendChild(el("span", null, plainLabel(p.label)));
          b.appendChild(document.createTextNode(p.number));
          more.appendChild(b);
        });
        c.appendChild(more);
      }
    } else {
      c.appendChild(el("p", "nd-nophone", v.noPhone || "No phone on file."));
    }
    if (v.why) c.appendChild(block("On this call", showWhy(v.why), "why"));
    var lastTitle = (v.lastWho === "Us" ? "We last said" : "They last said") + (v.lastDate ? " \u00b7 " + v.lastDate : "");
    if (v.lastMsg) c.appendChild(block(lastTitle, v.lastMsg, "said"));
    if (v.quote) c.appendChild(block(quoteTitle(v.quote), v.quote));
    var extra = extraDays(v);
    if (extra) c.appendChild(el("p", "nd-warn", extra));
    var note = extraNote(v);
    if (note && !fee) c.appendChild(el("p", "nd-warn", note));
    if ((opts.openEmails && v.venueId) || v.gmailThreadId) {
      var mail = el("div", "nd-acts");
      if (opts.openEmails && v.venueId) {
        var ob = el("button", null, "Emails");
        ob.type = "button";
        ob.onclick = function () { opts.openEmails(v); };
        mail.appendChild(ob);
      }
      if (v.gmailThreadId) {
        var ga = el("a", null, "Gmail");
        ga.href = "https://mail.google.com/mail/u/0/#all/" + encodeURIComponent(v.gmailThreadId);
        ga.target = "_blank";
        ga.rel = "noopener";
        mail.appendChild(ga);
      }
      c.appendChild(mail);
    }
    var mark = el("button", "nd-mark");
    mark.type = "button";
    c.appendChild(mark);
    var lbl = el("label", "nd-lbl", "What they said");
    var ta = el("textarea", "nd-notes");
    ta.placeholder = "Name, what they said, the next step";
    ta.id = "nd-notes-" + v.id;
    lbl.htmlFor = ta.id;
    ta.value = load("notes:" + v.id);
    var saveRow = el("div", "nd-saverow");
    var saveBtn = el("button", "nd-save", "Save");
    saveBtn.type = "button";
    var saved = el("span", "nd-saved", "");
    function stamp(t) { saved.textContent = t; }
    var st0 = load("notesAt:" + v.id);
    if (ta.value && st0) stamp("Saved " + st0);
    ta.addEventListener("input", function () { store("notes:" + v.id, ta.value); stamp("Not saved"); });
    saveBtn.addEventListener("click", function () {
      store("notes:" + v.id, ta.value);
      var n = new Date();
      var t = n.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) + " " + n.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      store("notesAt:" + v.id, ta.value ? t : "");
      stamp(ta.value ? "Saved " + t : "Cleared");
      ta.blur();
    });
    saveRow.appendChild(saveBtn);
    saveRow.appendChild(saved);
    c.appendChild(lbl);
    c.appendChild(ta);
    c.appendChild(saveRow);
    function paint() {
      var on = load("called:" + v.id) === "1";
      c.classList.toggle("called", on);
      mark.textContent = on ? "Called \u2014 tap to undo" : "Mark called";
      mark.setAttribute("aria-pressed", on ? "true" : "false");
    }
    mark.addEventListener("click", function () {
      store("called:" + v.id, load("called:" + v.id) === "1" ? "" : "1");
      paint();
      if (c._onChange) c._onChange();
    });
    paint();
    return c;
  }

  function build(root, data, opts) {
    window.ND_LIST_DATE = (data && data.listDate) || null;
    opts = opts || {};
    injectCss();
    root.innerHTML = "";
    var deck = el("div", "nd");
    deck.setAttribute("role", "region");
    deck.setAttribute("aria-label", "Calls");
    var bar = el("div", "nd-bar");
    var barI = el("i");
    bar.appendChild(barI);
    deck.appendChild(bar);
    var top = el("div", "nd-top");
    if (opts.onClose) {
      var close = el("button", "nd-close", "Board");
      close.type = "button";
      close.onclick = opts.onClose;
      top.appendChild(close);
    }
    var count = el("div", "nd-count");
    count.setAttribute("aria-live", "polite");
    top.appendChild(count);
    var jumpBtn = el("button", "nd-jumpbtn", "List");
    jumpBtn.type = "button";
    top.appendChild(jumpBtn);
    var arrows = el("div", "nd-arrows");
    var prev = el("button", null, "\u2039");
    var next = el("button", null, "\u203A");
    prev.type = next.type = "button";
    prev.setAttribute("aria-label", "Previous");
    next.setAttribute("aria-label", "Next");
    arrows.appendChild(prev);
    arrows.appendChild(next);
    top.appendChild(arrows);
    deck.appendChild(top);

    var body = el("div", "nd-body");
    var rail = el("nav", "nd-rail");
    rail.setAttribute("aria-label", "Call order");
    rail.appendChild(el("h3", null, "In order"));
    body.appendChild(rail);
    var stage = el("div", "nd-stage");
    var track = el("div", "nd-track");
    var cards = [];
    var intro = introCard(data, function () { go(1); });
    cards.push(intro);
    data.venues.forEach(function (v) { cards.push(venueCard(v, opts)); });
    cards.forEach(function (c) {
      var s = el("div", "nd-slide");
      s.appendChild(c);
      track.appendChild(s);
      c._onChange = function () { fillLists(); paintMeta(); };
    });
    stage.appendChild(track);
    body.appendChild(stage);
    deck.appendChild(body);

    var jump = el("div", "nd-jump");
    var jbox = el("div", "nd-jump-box");
    var jhead = el("div", "nd-jump-head");
    jhead.appendChild(el("span", null, "In order"));
    var jclose = el("button", null, "Close");
    jclose.type = "button";
    jhead.appendChild(jclose);
    jbox.appendChild(jhead);
    var jlist = el("div", "nd-jump-list");
    jbox.appendChild(jlist);
    jump.appendChild(jbox);
    deck.appendChild(jump);
    root.appendChild(deck);

    var total = data.venues.length;
    var idx = 0;
    function calledCount() {
      return data.venues.filter(function (v) { return load("called:" + v.id) === "1"; }).length;
    }
    function rowButton(label, sub, i, called, jumpItem) {
      var b = el("button", i === idx ? "on cur" : "");
      b.type = "button";
      b.appendChild(el("span", "r", i === 0 ? "\u00b7" : String(i)));
      var mid = el("span");
      mid.appendChild(el("span", "nm", label));
      if (sub) mid.appendChild(el("span", "tw", sub));
      b.appendChild(mid);
      b.appendChild(el("span", "dy", called ? "\u2713" : ""));
      b.onclick = function () { closeJump(); go(i, false); };
      if (jumpItem) b.classList.add("jump");
      return b;
    }
    function paintMeta() {
      var cc = calledCount();
      count.innerHTML = "";
      if (idx === 0) {
        count.appendChild(document.createTextNode("Tonight"));
        count.appendChild(el("small", null, cc + " of " + total + " called"));
      } else {
        count.appendChild(document.createTextNode(idx + " of " + total));
        count.appendChild(el("small", null, data.venues[idx - 1].venue));
      }
      var p = intro.querySelector(".nd-prog");
      if (p) p.textContent = cc ? (cc + " of " + total + " marked called on this phone.") : "Nothing marked called on this phone yet.";
      prev.disabled = idx <= 0;
      next.disabled = idx >= total;
      barI.style.width = (total ? Math.round((idx / total) * 100) : 0) + "%";
      var nodes = rail.querySelectorAll("button");
      for (var n = 0; n < nodes.length; n++) nodes[n].classList.toggle("on", Number(nodes[n].getAttribute("data-i")) === idx);
    }
    function fillLists() {
      rail.innerHTML = "";
      rail.appendChild(el("h3", null, "In order"));
      jlist.innerHTML = "";
      var brief = rowButton("Tonight", "Free nights and the rules", 0, false);
      brief.setAttribute("data-i", "0");
      rail.appendChild(brief);
      var jb0 = rowButton("Tonight", "Free nights and the rules", 0, false, true);
      jlist.appendChild(jb0);
      data.venues.forEach(function (v, k) {
        var called = load("called:" + v.id) === "1";
        var sub = v.town || "";
        var rb = rowButton(v.venue, sub, k + 1, called);
        rb.setAttribute("data-i", String(k + 1));
        rail.appendChild(rb);
        var jb = rowButton(v.venue, sub, k + 1, called, true);
        var name = jb.querySelector(".nm");
        (v.flags || []).forEach(function (f) {
          var d = el("span", "nd-dot " + (f.type || ""));
          d.title = f.text;
          if (name) name.appendChild(d);
        });
        jlist.appendChild(jb);
      });
    }
    function openJump() {
      fillLists();
      jump.classList.add("on");
      var cur = jlist.querySelector(".on");
      if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "center" });
    }
    function closeJump() { jump.classList.remove("on"); }
    jumpBtn.onclick = openJump;
    jclose.onclick = closeJump;
    jump.addEventListener("click", function (e) { if (e.target === jump) closeJump(); });

    function go(i, smooth) {
      i = Math.max(0, Math.min(total, i));
      idx = i;
      track.scrollTo({ left: i * track.clientWidth, behavior: smooth === false ? "auto" : "smooth" });
      fillLists();
      paintMeta();
      var on = rail.querySelector(".on");
      if (on && on.scrollIntoView) on.scrollIntoView({ block: "nearest" });
      store("last", String(i));
    }
    prev.onclick = function () { go(idx - 1); };
    next.onclick = function () { go(idx + 1); };
    track.addEventListener("scroll", function () {
      var w = track.clientWidth || 1;
      var i = Math.round(track.scrollLeft / w);
      if (i !== idx) { idx = Math.max(0, Math.min(total, i)); paintMeta(); store("last", String(idx)); }
    }, { passive: true });
    function onKey(e) {
      if (!deck.isConnected || root.classList.contains("suspended")) return;
      var tg = e.target && e.target.tagName;
      if (tg === "TEXTAREA" || tg === "INPUT" || tg === "SELECT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); }
      else if (e.key === "Escape") { if (jump.classList.contains("on")) closeJump(); else if (opts.onClose) opts.onClose(); }
    }
    document.addEventListener("keydown", onKey);
    function onResize() { track.scrollTo({ left: idx * track.clientWidth, behavior: "auto" }); }
    window.addEventListener("resize", onResize);

    var startAt = parseInt(load("last"), 10);
    if (opts.start != null) startAt = opts.start;
    idx = isNaN(startAt) ? 0 : Math.max(0, Math.min(total, startAt));
    fillLists();
    paintMeta();
    requestAnimationFrame(function () { go(idx, false); });

    return {
      go: go,
      index: function () { return idx; },
      refresh: function () { fillLists(); paintMeta(); },
      destroy: function () {
        document.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
        root.innerHTML = "";
      }
    };
  }

  window.NatCallDeck = { build: build };

  var deckApi = null;
  var cache = null;
  function host() {
    var h = document.getElementById("calls");
    if (!h) { h = el("div"); h.id = "calls"; document.body.appendChild(h); }
    return h;
  }
  var suspendedAt = -1;
  function openEmails(v) {
    var h = document.getElementById("calls");
    if (!h || !deckApi || typeof window.natOpen !== "function") return;
    var det = document.getElementById("detail");
    if (det) det.innerHTML = "";
    suspendedAt = deckApi.index();
    h.classList.add("suspended");
    document.documentElement.style.overflow = "";
    window.natOpen(v.venueId);
    if (!det || !det.querySelector(".back")) {
      suspendedAt = -1;
      h.classList.remove("suspended");
      document.documentElement.style.overflow = "hidden";
      if (window.natBack && window.natBack.__orig) window.natBack.__orig();
      alert("That venue is not on the board right now.");
      return;
    }
    if (typeof window.natEmails === "function" && det.querySelector(".openbtn")) window.natEmails();
    window.scrollTo(0, 0);
    var panels = det.querySelectorAll(".panel .kicker");
    for (var i = 0; i < panels.length; i++) {
      if (/^Emails/.test(panels[i].textContent)) {
        var head = det.querySelector("header");
        var y = panels[i].getBoundingClientRect().top + window.pageYOffset - (head ? head.offsetHeight : 0) - 8;
        window.scrollTo(0, Math.max(0, y));
        break;
      }
    }
  }
  function resumeCalls() {
    var h = document.getElementById("calls");
    if (suspendedAt < 0 || !h || !deckApi) return;
    var i = suspendedAt;
    suspendedAt = -1;
    h.classList.remove("suspended");
    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);
    deckApi.go(i, false);
  }
  (function wrapBack() {
    var orig = window.natBack;
    if (typeof orig !== "function" || orig.__calls) return;
    var wrapped = function () {
      var r = orig.apply(this, arguments);
      resumeCalls();
      return r;
    };
    wrapped.__calls = true;
    wrapped.__orig = orig;
    window.natBack = wrapped;
  })();

  window.natCallsClose = function () {
    var h = document.getElementById("calls");
    suspendedAt = -1;
    if (h) h.classList.remove("suspended");
    if (deckApi) { deckApi.destroy(); deckApi = null; }
    if (h) h.classList.remove("show");
    document.documentElement.style.overflow = "";
  };
  window.natCalls = function () {
    var app = document.getElementById("app");
    if (!app || !app.classList.contains("show")) return;
    var h = host();
    function open(data) {
      injectCss();
      h.classList.add("show");
      document.documentElement.style.overflow = "hidden";
      deckApi = build(h, data, { onClose: window.natCallsClose, openEmails: openEmails });
      window.NatCallDeck.current = deckApi;
    }
    if (cache) { open(cache); return; }
    fetch("calls.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("calls.json " + r.status); return r.json(); })
      .then(function (data) {
        if (!data || !Array.isArray(data.venues)) throw new Error("calls.json has no venues");
        cache = data;
        open(data);
      })
      .catch(function (e) {
        injectCss();
        h.classList.add("show");
        h.innerHTML = "";
        var box = el("div", "nd");
        var card = el("div", "nd-card");
        card.style.margin = "20px";
        card.style.height = "auto";
        card.appendChild(el("h2", null, "Call list did not load"));
        card.appendChild(el("p", null, String(e && e.message || e)));
        var b = el("button", "nd-mark", "Back to the board");
        b.type = "button";
        b.onclick = window.natCallsClose;
        card.appendChild(b);
        box.appendChild(card);
        h.appendChild(box);
      });
  };
  injectCss();
})();
