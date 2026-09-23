(function () {
  var list = window.JE_RECORDINGS || [];
  var byId = {};
  list.forEach(function (r) { byId[r.id] = r; });
  var audioQueue = list.filter(function (r) { return r.kind === "audio" || (r.source === "file" && /\.(mp3|m4a|aac|ogg)(\?|$)/i.test(r.src || "")); }).map(function (r) { return r.id; });
  var queue = audioQueue.length ? audioQueue.slice() : list.map(function (r) { return r.id; });
  var current = null;
  var expanded = false;
  var audio = new Audio();
  audio.preload = "metadata";
  audio.setAttribute("playsinline", "true");

  var STORE = "je-radio-v1";

  function poster(r) {
    if (!r) return "/images/studio-gold.jpg";
    if (r.poster) return r.poster;
    if (r.source === "youtube" && r.videoId) return "https://i.ytimg.com/vi/" + r.videoId + "/hqdefault.jpg";
    return "/images/studio-gold.jpg";
  }
  function href(r) {
    if (r.source === "file" && r.src) return r.src;
    if (r.source === "facebook") return "https://www.facebook.com/itsjakeessex/videos/" + r.videoId + "/";
    return "https://www.youtube.com/watch?v=" + r.videoId;
  }
  function isAudio(r) {
    return !!(r && (r.kind === "audio" || (r.source === "file" && /\.(mp3|m4a|aac|ogg)(\?|$)/i.test(r.src || ""))));
  }
  function frame(r) {
    if (isAudio(r)) {
      return '<div class="radio-viz" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div><p class="avail">Playing while you browse. Tap tracks in the vault or keep scrolling the site.</p>';
    }
    if (r.source === "file" && r.src) {
      return '<video id="player-clip" controls playsinline webkit-playsinline autoplay preload="auto" poster="'+poster(r)+'" src="'+r.src+'" style="display:block;margin:0 auto;max-height:62vh;width:auto;max-width:100%;background:#070707"></video>';
    }
    if (r.source === "facebook") {
      var u = encodeURIComponent(href(r));
      return '<iframe title="'+r.song+'" src="https://www.facebook.com/plugins/video.php?href='+u+'&show_text=false&width=500" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>';
    }
    return '<iframe title="'+r.song+'" src="https://www.youtube-nocookie.com/embed/'+r.videoId+'?autoplay=1&rel=0&modestbranding=1&playsinline=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
  }

  var bar = document.getElementById("player");
  var stage = document.getElementById("player-stage");
  var art = document.getElementById("player-art");
  var songEl = document.getElementById("player-song");
  var origEl = document.getElementById("player-orig");
  var playBtn = document.getElementById("player-play");
  var scrub = document.getElementById("player-scrub");
  var timeEl = document.getElementById("player-time");

  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({
        id: current,
        t: audio.currentTime || 0,
        q: queue,
        playing: !audio.paused
      }));
    } catch (e) {}
  }
  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORE) || "null"); } catch (e) { return null; }
  }

  function fmt(s) {
    if (!isFinite(s)) return "0:00";
    s = Math.max(0, Math.floor(s));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  function setPlayingUi(on) {
    if (playBtn) {
      playBtn.textContent = on ? "Pause" : "Play";
      playBtn.setAttribute("aria-label", on ? "Pause" : "Play");
    }
    document.body.classList.toggle("is-playing", !!on);
  }

  function kickPlayerClip() {
    var v = document.getElementById("player-clip");
    if (v && v.play) {
      v.setAttribute("playsinline", "true");
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  function render() {
    var r = current ? byId[current] : null;
    if (!bar) return;
    if (!r) {
      bar.hidden = true;
      document.body.classList.remove("has-player");
      return;
    }
    bar.hidden = false;
    document.body.classList.add("has-player");
    if (art) art.src = poster(r);
    if (songEl) songEl.textContent = r.song;
    if (origEl) origEl.textContent = (r.original || "") + (r.year ? " · " + r.year : "");
    if (expanded) {
      if (stage) {
        stage.hidden = false;
        stage.innerHTML = frame(r);
      }
      if (!isAudio(r)) kickPlayerClip();
    } else if (stage) {
      stage.hidden = true;
      stage.innerHTML = "";
    }
    document.querySelectorAll("[data-track]").forEach(function (el) {
      el.classList.toggle("is-on", el.getAttribute("data-track") === r.id);
    });
    setPlayingUi(isAudio(r) ? !audio.paused : expanded);
  }

  function stopMedia() {
    audio.pause();
    var v = document.getElementById("player-clip");
    if (v && v.pause) v.pause();
    if (stage) {
      var ifr = stage.querySelector("iframe");
      if (ifr) ifr.src = "about:blank";
    }
  }

  function play(id, q, opts) {
    opts = opts || {};
    if (q && q.length) queue = q.slice();
    var r = byId[id];
    if (!r) return;
    current = id;
    expanded = !!opts.expand || !isAudio(r);
    stopMedia();
    if (isAudio(r)) {
      audio.src = r.src;
      audio.load();
      var startAt = opts.at || 0;
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
      if (startAt > 0) {
        audio.addEventListener("loadedmetadata", function once() {
          audio.removeEventListener("loadedmetadata", once);
          try { audio.currentTime = startAt; } catch (e) {}
        });
      }
    }
    render();
    save();
  }

  function toggle() {
    var r = current ? byId[current] : null;
    if (!r) {
      if (queue[0]) play(queue[0], queue, { expand: false });
      return;
    }
    if (isAudio(r)) {
      if (audio.paused) {
        var p = audio.play();
        if (p && p.catch) p.catch(function () {});
      } else audio.pause();
      setPlayingUi(!audio.paused);
      save();
    } else {
      expanded = !expanded;
      render();
    }
  }

  function step(dir) {
    if (!queue.length) return;
    var i = current ? queue.indexOf(current) : -1;
    if (i < 0) i = 0;
    else i = (i + dir + queue.length) % queue.length;
    play(queue[i], queue, { expand: false });
  }

  audio.addEventListener("timeupdate", function () {
    if (scrub && audio.duration) scrub.value = String((audio.currentTime / audio.duration) * 1000);
    if (timeEl) timeEl.textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration);
    if (Math.floor(audio.currentTime) % 3 === 0) save();
  });
  audio.addEventListener("play", function () { setPlayingUi(true); save(); });
  audio.addEventListener("pause", function () { setPlayingUi(false); save(); });
  audio.addEventListener("ended", function () { step(1); });

  if (scrub) {
    scrub.addEventListener("input", function () {
      if (!audio.duration) return;
      audio.currentTime = (Number(scrub.value) / 1000) * audio.duration;
      save();
    });
  }

  window.JE = {
    play: play,
    playNight: function () {
      var night = window.JE_NIGHT || audioQueue;
      play(night[0], night, { expand: false });
    },
    playFavourites: function () {
      play(audioQueue[0], audioQueue, { expand: false });
    },
    toggle: toggle,
    poster: poster,
    list: list,
    audioQueue: audioQueue
  };

  var tog = document.getElementById("player-toggle");
  if (tog) tog.addEventListener("click", function () {
    var r = current ? byId[current] : null;
    if (r && isAudio(r)) toggle();
    else { expanded = !expanded; render(); }
  });
  if (playBtn) playBtn.addEventListener("click", function () { toggle(); });
  var prev = document.getElementById("player-prev");
  if (prev) prev.addEventListener("click", function () { step(-1); });
  var next = document.getElementById("player-next");
  if (next) next.addEventListener("click", function () { step(1); });
  var cls = document.getElementById("player-close");
  if (cls) cls.addEventListener("click", function () {
    stopMedia();
    current = null;
    expanded = false;
    render();
    try { localStorage.removeItem(STORE); } catch (e) {}
  });

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-play]");
    if (!t) return;
    e.preventDefault();
    var id = t.getAttribute("data-play");
    if (id === "night") window.JE.playNight();
    else if (id === "favourites") window.JE.playFavourites();
    else play(id, isAudio(byId[id]) ? audioQueue : null, { expand: !isAudio(byId[id]) });
  });

  function mountVault() {
    var mount = document.getElementById("vault");
    if (!mount) return;
    var html = "";
    // Favourites audio first
    var favs = list.filter(isAudio);
    var vids = list.filter(function (r) { return !isAudio(r); });
    if (favs.length) {
      html += '<p class="vault-label">Favourites — studio &amp; live</p>';
      favs.forEach(function (r) {
        html += '<button type="button" class="track track-audio" data-play="'+r.id+'" data-track="'+r.id+'">'
          + '<span class="track-play">♪</span>'
          + '<span><strong>'+r.song+'</strong><span>'+(r.original||"")+(r.year?(" · "+r.year):"")+'</span></span>'
          + '</button>';
      });
    }
    if (vids.length) {
      html += '<p class="vault-label">On film</p>';
      vids.forEach(function (r) {
        html += '<button type="button" class="track" data-play="'+r.id+'" data-track="'+r.id+'">'
          + '<img src="'+poster(r)+'" alt="">'
          + '<span><strong>'+r.song+'</strong><span>'+(r.original||"")+(r.year?(" · "+r.year):"")+'</span></span>'
          + '</button>';
      });
    }
    mount.innerHTML = html;
  }
  function mountWall() {
    var mount = document.getElementById("video-wall");
    if (!mount) return;
    var html = "";
    list.filter(function (r) { return !isAudio(r); }).forEach(function (r) {
      html += '<button type="button" class="vcard" data-play="'+r.id+'">'
        + '<span class="thumb"><img src="'+poster(r)+'" alt=""></span>'
        + '<p>'+r.song+'</p><small>'+(r.original||"")+(r.year?(" · "+r.year):"")+'</small>'
        + '</button>';
    });
    mount.innerHTML = html;
  }

  // Resume radio across pages
  var st = loadState();
  if (st && st.id && byId[st.id] && isAudio(byId[st.id])) {
    queue = st.q && st.q.length ? st.q : audioQueue;
    play(st.id, queue, { expand: false, at: st.t || 0 });
    if (!st.playing) audio.pause();
  }

  function remount() {
    mountVault();
    mountWall();
    render();
  }
  window.JE.remount = remount;
  document.addEventListener("je:softnav", remount);

  mountVault();
  mountWall();
})();
