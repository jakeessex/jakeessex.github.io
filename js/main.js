(function () {
  var EMAIL = "jakeessexenquiries@gmail.com";
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  // Private page-view ping. Does not print or display a count.
  try {
    var path = location.pathname || "/";
    if (!/bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|preview/i.test(navigator.userAgent || "")) {
      var page = path.replace(/\.html$/i, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home";
      var day = new Date().toISOString().slice(0, 10);
      var seenKey = "jem-hit-" + page;
      if (!sessionStorage.getItem(seenKey)) {
        sessionStorage.setItem(seenKey, "1");
        var ns = "jem338ec24154f1667e";
        ["all", "p-" + page, "d-" + day].forEach(function (k) {
          fetch("https://abacus.jasoncameron.dev/hit/" + ns + "/" + k, {
            mode: "cors",
            cache: "no-store",
            keepalive: true
          }).catch(function () {});
        });
      }
    }
  } catch (e) {}

  var menuBtn = document.getElementById("menu-btn");
  var drawer = document.getElementById("mobile-nav");
  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", function () {
      var open = drawer.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll("[data-video-id]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-video-id");
      var title = btn.getAttribute("data-video-title") || "Jake Essex";
      var wrap = btn.parentElement;
      wrap.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + title + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    });
  });

  document.querySelectorAll("[data-tab]").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var id = tab.getAttribute("data-tab");
      document.querySelectorAll("[data-tab]").forEach(function (t) { t.setAttribute("aria-selected", t === tab ? "true" : "false"); });
      document.querySelectorAll("[data-panel]").forEach(function (p) {
        p.hidden = p.getAttribute("data-panel") !== id;
      });
    });
  });

  function val(form, name) {
    var el = form.elements[name];
    return el && el.value ? String(el.value).trim() : "";
  }
  function niceDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    if (p.length !== 3) return iso;
    return parseInt(p[2], 10) + " " + MONTHS[parseInt(p[1], 10) - 1] + " " + p[0];
  }
  function niceTime(t) {
    if (!t) return "";
    var p = t.split(":");
    var h = parseInt(p[0], 10);
    var min = p[1] || "00";
    var ap = h >= 12 ? "pm" : "am";
    var h12 = h % 12 || 12;
    return min === "00" ? h12 + ap : h12 + ":" + min + ap;
  }
  function openMail(subject, body) {
    window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  var params = new URLSearchParams(window.location.search);
  var preset = params.get("package");
  var gig = document.getElementById("gig-form");
  if (gig) {
    if (preset && gig.elements.package) gig.elements.package.value = preset;
    gig.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("form-status");
      var err = document.getElementById("form-error");
      var name = val(gig, "name");
      var contact = val(gig, "contact");
      var date = val(gig, "date");
      var time = val(gig, "time");
      var venue = val(gig, "venue");
      var pkg = val(gig, "package");
      if (!name || !contact || !date || !time || !venue || !pkg) {
        if (err) { err.hidden = false; err.textContent = "Fill in name, contact, date, time, venue and which show."; }
        return;
      }
      var extra = val(gig, "message");
      var body = ["Hi Jake,", "", "I want to book you for " + niceDate(date) + " " + niceTime(time) + " at " + venue + ".", "", "Name: " + name, "Email / phone: " + contact, "Show: " + pkg];
      if (extra) body.push("", extra);
      var text = body.join("\n");
      fetch("https://formsubmit.co/ajax/" + EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name: name, email: contact, _subject: "Gig enquiry — Jake Essex", _captcha: "false", message: text })
      }).then(function (r) {
        if (!r.ok) throw new Error("fail");
        gig.hidden = true;
        if (status) { status.hidden = false; status.innerHTML = "<p><strong>Enquiry sent.</strong></p><p>If the date is free, Jake will come back on the same email.</p>"; }
      }).catch(function () {
        openMail("Gig enquiry — Jake Essex", text);
      });
    });
  }

  var vehicle = document.getElementById("vehicle-form");
  if (vehicle) {
    vehicle.addEventListener("submit", function (e) {
      e.preventDefault();
      var body = [
        "Name: " + val(vehicle, "name"),
        "Phone: " + val(vehicle, "phone"),
        "Postcode: " + val(vehicle, "postcode"),
        "Make / model: " + val(vehicle, "vehicle"),
        "Job: " + val(vehicle, "job"),
        "", "Notes:", val(vehicle, "issue") || "(none)"
      ].join("\n");
      fetch("https://formsubmit.co/ajax/" + EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name: val(vehicle, "name"), email: val(vehicle, "phone"), _subject: "Vehicle enquiry — Jake Essex", _captcha: "false", message: body })
      }).then(function (r) {
        if (!r.ok) throw new Error("fail");
        vehicle.hidden = true;
        var s = document.getElementById("vehicle-status");
        if (s) s.hidden = false;
      }).catch(function () { openMail("Vehicle enquiry — Jake Essex", body); });
    });
  }

  var review = document.getElementById("review-form");
  if (review) {
    review.addEventListener("submit", function (e) {
      e.preventDefault();
      if (val(review, "_gotcha")) return;
      var err = document.getElementById("review-error");
      var status = document.getElementById("review-status");
      var who = val(review, "who");
      var place = val(review, "place");
      var email = val(review, "email");
      var stars = val(review, "stars") || "5";
      var quote = val(review, "quote");
      if (!who || !quote) {
        if (err) { err.hidden = false; err.textContent = "Name and a few sentences, then send."; }
        return;
      }
      var body = ["Name: " + who, "Venue / town: " + (place || "—"), "Stars: " + stars + "/5", "Email: " + (email || "—"), "", quote].join("\n");
      var payload = {
        name: who,
        email: email || EMAIL,
        _subject: "Review — " + who,
        _captcha: "false",
        message: body
      };
      fetch("https://formsubmit.co/ajax/" + EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error("fail");
        review.hidden = true;
        if (status) status.hidden = false;
      }).catch(function () {
        openMail("Review — " + who, body);
      });
    });
  }
})();

  /* Soft navigate same-origin pages so the sticky radio keeps playing */
  (function softNav() {
    var main = document.querySelector("main");
    if (!main || !window.history || !window.fetch) return;
    var busy = false;

    function sameOrigin(a) {
      try {
        var u = new URL(a.href, location.href);
        return u.origin === location.origin && !a.hasAttribute("download") && a.target !== "_blank";
      } catch (e) { return false; }
    }
    function looksLikePage(href) {
      return /\.html($|\?|#)/i.test(href) || href === "/" || /\/$/.test(href.split("?")[0].split("#")[0]);
    }
    function swap(html, url) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var nextMain = doc.querySelector("main");
      var nextTitle = doc.querySelector("title");
      if (!nextMain) { location.href = url; return; }
      main.replaceWith(nextMain);
      main = document.querySelector("main");
      if (nextTitle) document.title = nextTitle.textContent;
      history.pushState({ soft: 1 }, "", url);
      document.body.classList.remove("nav-open");
      var drawer = document.getElementById("mobile-nav");
      var menuBtn = document.getElementById("menu-btn");
      if (drawer) drawer.classList.remove("open");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
      document.querySelectorAll(".nav-desktop a, .nav-drawer a").forEach(function (a) {
        var path = new URL(a.href, location.href).pathname;
        a.classList.toggle("is-active", path === location.pathname);
      });
      window.scrollTo(0, 0);
      if (window.JE && typeof window.JE.remount === "function") window.JE.remount();
      else {
        // remount vault/wall if scripts already ran — fire custom event
        document.dispatchEvent(new CustomEvent("je:softnav"));
      }
    }
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a || !sameOrigin(a) || !looksLikePage(a.getAttribute("href") || a.href)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var url = a.href;
      if (new URL(url).pathname === location.pathname && !new URL(url).search) return;
      e.preventDefault();
      if (busy) return;
      busy = true;
      fetch(url, { credentials: "same-origin" }).then(function (r) {
        if (!r.ok) throw new Error("nav");
        return r.text();
      }).then(function (html) { swap(html, url); }).catch(function () {
        location.href = url;
      }).finally(function () { busy = false; });
    });
    window.addEventListener("popstate", function () {
      fetch(location.href, { credentials: "same-origin" }).then(function (r) { return r.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, "text/html");
          var nextMain = doc.querySelector("main");
          if (!nextMain) { location.reload(); return; }
          main.replaceWith(nextMain);
          main = document.querySelector("main");
          document.title = (doc.querySelector("title") || {}).textContent || document.title;
          window.scrollTo(0, 0);
          document.dispatchEvent(new CustomEvent("je:softnav"));
        }).catch(function () { location.reload(); });
    });
  })();
