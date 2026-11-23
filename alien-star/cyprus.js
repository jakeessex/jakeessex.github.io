(function () {
  "use strict";

  /* SHA-256 of the shared passcode. The word itself is not stored here. */
  var PASS_HASH = "f7a17e34b190fbb7345facdd5491897a1b85d1612d3bf7f5df5f07ee689cc33b";
  var STORE_KEY = "je-kk-cyprus";

  var root = document.documentElement;
  var gateForm = document.getElementById("gate-form");
  var passInput = document.getElementById("pass");
  var gateMsg = document.getElementById("gate-msg");
  var holiday = document.getElementById("holiday");
  var timer = document.getElementById("countdown");
  var live = document.getElementById("count-live");
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbAvif = document.getElementById("lb-avif");
  var lbCap = document.getElementById("lb-cap");
  var lbCount = document.getElementById("lb-count");
  var theme = document.querySelector('meta[name="theme-color"]');

  var tickHandle = 0;
  var lastSpoken = "";
  var shots = [];
  var lbIndex = 0;
  var lastFocus = null;
  var swipe = null;
  var ignoreClick = false;

  function hex(buffer) {
    var bytes = new Uint8Array(buffer);
    var out = "";
    for (var i = 0; i < bytes.length; i++) {
      out += bytes[i].toString(16).padStart(2, "0");
    }
    return out;
  }

  function digest(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(hex);
  }

  function setTheme(color) {
    if (theme) theme.setAttribute("content", color);
  }

  function awaken(scope) {
    var sources = scope.querySelectorAll("source[data-srcset]");
    for (var i = 0; i < sources.length; i++) {
      sources[i].srcset = sources[i].getAttribute("data-srcset");
    }
    var images = scope.querySelectorAll("img[data-src]");
    for (var j = 0; j < images.length; j++) {
      var img = images[j];
      if (img.getAttribute("data-srcset")) img.srcset = img.getAttribute("data-srcset");
      try {
        if (img.classList.contains("hero-bg")) img.fetchPriority = "high";
      } catch (err) {}
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
    }
  }

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function put(unit, text) {
    var el = timer.querySelector('[data-unit="' + unit + '"]');
    if (el && el.textContent !== text) el.textContent = text;
  }

  function label(unit, text) {
    var el = timer.querySelector('[data-label="' + unit + '"]');
    if (el && el.textContent !== text) el.textContent = text;
  }

  function phrase(n, word) {
    return n + " " + (n === 1 ? word : word + "s");
  }

  function render() {
    var target = Date.parse(timer.getAttribute("data-takeoff"));
    var diff = target - Date.now();
    var arrived = timer.querySelector(".arrived");
    var digits = timer.querySelector(".digits");
    var when = document.getElementById("when");

    if (!(diff > 0)) {
      arrived.hidden = false;
      digits.hidden = true;
      when.textContent = "Feet up. The sea view is yours.";
      if (live.textContent !== "We're in Cyprus!") live.textContent = "We're in Cyprus!";
      stopClock();
      return;
    }

    arrived.hidden = true;
    digits.hidden = false;
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor(diff / 3600000) % 24;
    var minutes = Math.floor(diff / 60000) % 60;
    var seconds = Math.floor(diff / 1000) % 60;
    put("days", String(days));
    put("hours", pad(hours));
    put("minutes", pad(minutes));
    put("seconds", pad(seconds));
    label("days", days === 1 ? "Day" : "Days");
    label("hours", hours === 1 ? "Hour" : "Hours");
    label("minutes", minutes === 1 ? "Minute" : "Minutes");
    label("seconds", seconds === 1 ? "Second" : "Seconds");

    var spoken = phrase(days, "day") + ", " + phrase(hours, "hour") + " and " + phrase(minutes, "minute") + " until take-off.";
    if (spoken !== lastSpoken) {
      lastSpoken = spoken;
      live.textContent = spoken;
    }
  }

  function startClock() {
    render();
    if (!tickHandle) tickHandle = window.setInterval(render, 250);
  }

  function stopClock() {
    if (tickHandle) window.clearInterval(tickHandle);
    tickHandle = 0;
  }

  function showHoliday(moveFocus) {
    root.classList.add("is-open");
    holiday.hidden = false;
    setTheme("#102838");
    awaken(holiday);
    startClock();
    if (moveFocus) {
      var heading = holiday.querySelector("h1");
      if (heading) heading.focus();
    }
  }

  function closeLightbox(silent) {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    root.classList.remove("lb-open");
    if (!silent && lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  function lockPage() {
    try { localStorage.removeItem(STORE_KEY); } catch (err) {}
    closeLightbox(true);
    root.classList.remove("is-open");
    holiday.hidden = true;
    setTheme("#e07a55");
    passInput.focus();
  }

  function openAt(index, focusClose) {
    if (!shots.length) return;
    lbIndex = (index + shots.length) % shots.length;
    var shot = shots[lbIndex];
    lbAvif.srcset = shot.getAttribute("data-full-avif");
    lbImg.src = shot.getAttribute("data-full");
    var thumb = shot.querySelector("img");
    lbImg.alt = thumb ? thumb.alt : "";
    lbCap.textContent = shot.getAttribute("data-caption") || "";
    lbCount.textContent = (lbIndex + 1) + " of " + shots.length;
    lightbox.setAttribute("aria-label", lbCap.textContent);
    lightbox.hidden = false;
    root.classList.add("lb-open");
    if (focusClose) {
      var closeBtn = lightbox.querySelector(".lb-close");
      if (closeBtn) closeBtn.focus();
    }
  }

  function step(delta) {
    openAt(lbIndex + delta, false);
  }

  gateForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var norm = (passInput.value || "").trim().toLowerCase();
    if (!norm) {
      gateMsg.textContent = "Type the passcode.";
      passInput.setAttribute("aria-invalid", "true");
      return;
    }
    if (!window.crypto || !crypto.subtle) {
      gateMsg.textContent = "Open this page on a secure connection and try again.";
      return;
    }
    digest(norm).then(function (hash) {
      if (hash !== PASS_HASH) {
        gateMsg.textContent = "That's not the one.";
        passInput.setAttribute("aria-invalid", "true");
        gateForm.classList.remove("shake");
        void gateForm.offsetWidth;
        gateForm.classList.add("shake");
        passInput.select();
        return;
      }
      passInput.value = "";
      passInput.removeAttribute("aria-invalid");
      gateMsg.textContent = "";
      try { localStorage.setItem(STORE_KEY, "1"); } catch (err) {}
      showHoliday(true);
    }).catch(function () {
      gateMsg.textContent = "Couldn't check that just now. Try again.";
    });
  });

  passInput.addEventListener("input", function () {
    gateMsg.textContent = "";
    passInput.removeAttribute("aria-invalid");
  });

  document.getElementById("lock").addEventListener("click", lockPage);

  shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
  document.querySelector(".reel").addEventListener("click", function (event) {
    var shot = event.target.closest(".shot");
    if (!shot) return;
    lastFocus = shot;
    openAt(shots.indexOf(shot), true);
  });

  lightbox.querySelector(".lb-close").addEventListener("click", function () { closeLightbox(false); });
  lightbox.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
  lightbox.querySelector(".lb-next").addEventListener("click", function () { step(1); });
  lightbox.addEventListener("click", function (event) {
    if (ignoreClick) {
      ignoreClick = false;
      return;
    }
    if (event.target === lightbox || event.target.tagName === "FIGURE") closeLightbox(false);
  });
  lightbox.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox(false);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
      return;
    }
    if (event.key !== "Tab") return;
    var buttons = lightbox.querySelectorAll("button");
    if (!buttons.length) return;
    var first = buttons[0];
    var last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  lightbox.addEventListener("pointerdown", function (event) {
    if (event.target.closest("button")) return;
    swipe = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  lightbox.addEventListener("pointerup", function (event) {
    if (!swipe || event.pointerId !== swipe.id) return;
    var dx = event.clientX - swipe.x;
    var dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    ignoreClick = true;
    step(dx < 0 ? 1 : -1);
  });
  lightbox.addEventListener("pointercancel", function () { swipe = null; });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && root.classList.contains("is-open")) render();
  });

  if (root.classList.contains("is-open")) showHoliday(false);
})();
