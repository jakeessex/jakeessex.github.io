(function () {
  var list = window.JE_RECORDINGS || [];
  var byId = {};
  list.forEach(function (r) { byId[r.id] = r; });
  var queue = list.map(function (r) { return r.id; });
  var current = null;
  var expanded = false;

  function poster(r) {
    if (r.poster) return r.poster;
    if (r.source === "youtube") return "https://i.ytimg.com/vi/" + r.videoId + "/hqdefault.jpg";
    return "/images/studio-gold.jpg";
  }
  function href(r) {
    return r.source === "facebook"
      ? "https://www.facebook.com/itsjakeessex/videos/" + r.videoId + "/"
      : "https://www.youtube.com/watch?v=" + r.videoId;
  }
  function frame(r) {
    if (r.source === "facebook") {
      var u = encodeURIComponent(href(r));
      return '<iframe title="'+r.song+'" src="https://www.facebook.com/plugins/video.php?href='+u+'&show_text=false&width=500" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe><p class="avail">If the film doesn’t load here, <a href="'+href(r)+'" rel="noopener noreferrer" target="_blank">open it on Facebook</a>.</p>';
    }
    return '<iframe title="'+r.song+'" src="https://www.youtube-nocookie.com/embed/'+r.videoId+'?autoplay=1&rel=0&modestbranding=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
  }

  var bar = document.getElementById("player");
  var stage = document.getElementById("player-stage");
  var art = document.getElementById("player-art");
  var songEl = document.getElementById("player-song");
  var origEl = document.getElementById("player-orig");

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
    art.src = poster(r);
    songEl.textContent = r.song;
    origEl.textContent = r.original + (r.year ? " · " + r.year : "");
    if (expanded) {
      stage.hidden = false;
      stage.innerHTML = frame(r);
    } else {
      stage.hidden = true;
      stage.innerHTML = "";
    }
    document.querySelectorAll("[data-track]").forEach(function (el) {
      el.classList.toggle("is-on", el.getAttribute("data-track") === r.id);
    });
  }

  function play(id, q) {
    if (q && q.length) queue = q.slice();
    current = id;
    expanded = true;
    render();
    if (bar) bar.scrollIntoView({ block: "end" });
  }
  function step(dir) {
    if (!current || !queue.length) return;
    var i = queue.indexOf(current);
    if (i < 0) i = 0;
    current = queue[(i + dir + queue.length) % queue.length];
    expanded = true;
    render();
  }

  window.JE = {
    play: play,
    playNight: function () { play(window.JE_NIGHT[0], window.JE_NIGHT); },
    poster: poster,
    list: list
  };

  var tog = document.getElementById("player-toggle");
  if (tog) tog.addEventListener("click", function () { expanded = !expanded; render(); });
  var prev = document.getElementById("player-prev");
  if (prev) prev.addEventListener("click", function () { step(-1); });
  var next = document.getElementById("player-next");
  if (next) next.addEventListener("click", function () { step(1); });
  var cls = document.getElementById("player-close");
  if (cls) cls.addEventListener("click", function () { current = null; expanded = false; render(); });

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-play]");
    if (!t) return;
    e.preventDefault();
    var id = t.getAttribute("data-play");
    if (id === "night") window.JE.playNight();
    else play(id);
  });

  function mountVault() {
    var mount = document.getElementById("vault");
    if (!mount) return;
    var html = "";
    list.forEach(function (r) {
      html += '<button type="button" class="track" data-play="'+r.id+'" data-track="'+r.id+'">'
        + '<img src="'+poster(r)+'" alt="">'
        + '<span><strong>'+r.song+'</strong><span>'+r.original+(r.year?(" · "+r.year):"")+(r.kind==="short"?" · clip":"")+'</span></span>'
        + '</button>';
    });
    mount.innerHTML = html;
  }
  function mountWall() {
    var mount = document.getElementById("video-wall");
    if (!mount) return;
    var html = "";
    list.forEach(function (r) {
      html += '<button type="button" class="vcard" data-play="'+r.id+'">'
        + '<span class="thumb"><img src="'+poster(r)+'" alt=""></span>'
        + '<p>'+r.song+'</p><small>'+r.original+(r.year?(" · "+r.year):"")+'</small>'
        + '</button>';
    });
    mount.innerHTML = html;
  }
  mountVault();
  mountWall();
})();
