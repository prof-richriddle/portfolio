(function () {
  // Portfolio page only: type buttons and topic filters.
  var typeBtns = document.querySelectorAll("[data-show]");
  var chips = document.querySelectorAll(".chip");
  if (!typeBtns.length) return;
  var sections = document.querySelectorAll("section[data-type]");
  var state = { show: "all", topic: "all" };

  function apply() {
    sections.forEach(function (sec) {
      sec.hidden = !(state.show === "all" || sec.dataset.type === state.show);
      var items = sec.querySelectorAll("[data-topics]");
      if (!items.length) return;
      var shown = 0;
      items.forEach(function (el) {
        var list = el.dataset.topics.trim().split(/\s+/);
        var ok = state.topic === "all" || list.indexOf(state.topic) > -1;
        el.hidden = !ok;
        if (ok) shown++;
      });
      var empty = sec.querySelector(".empty");
      if (empty) empty.hidden = shown > 0;
    });
    typeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.show === state.show)); });
    chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.topic === state.topic)); });
  }

  typeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      state.show = b.dataset.show;
      apply();
      try { history.replaceState(null, "", state.show === "all" ? location.pathname : "#" + state.show); } catch (e) {}
    });
  });
  chips.forEach(function (c) {
    c.addEventListener("click", function () { state.topic = c.dataset.topic; apply(); });
  });

  var start = (location.hash || "").replace("#", "");
  if (["major", "samples", "abstracts"].indexOf(start) > -1) state.show = start;
  apply();
})();

(function () {
  // Button beeps.
  // Visitors can turn them off with the Sound button in the footer.
  var KEY = "beeps";
  var on = true;
  try { on = localStorage.getItem(KEY) !== "off"; } catch (e) {}
  var ctx = null;

  // Sound files live in assets/sounds/. If a file is missing, a tone made in the browser plays instead.
  var base = (document.querySelector('link[href$="style.css"]') || {}).href || "";
  base = base.replace(/assets\/css\/style\.css.*$/, "assets/sounds/");
  var FILES = { go: "beep2.mp3", tap: "beep1.mp3" };
  var clips = {};
  Object.keys(FILES).forEach(function (k) {
    var a = new Audio(base + FILES[k]);
    a.preload = "auto";
    a.addEventListener("error", function () { clips[k] = null; });
    clips[k] = a;
  });

  function tone(kind) {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      var t = ctx.currentTime;
      var notes = kind === "go" ? [880, 1320] : [1175];
      notes.forEach(function (f, i) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = f;
        var s = t + i * 0.07;
        g.gain.setValueAtTime(0.0001, s);
        g.gain.exponentialRampToValueAtTime(0.12, s + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, s + 0.09);
        o.connect(g); g.connect(ctx.destination);
        o.start(s); o.stop(s + 0.1);
      });
    } catch (e) {}
  }

  function beep(kind) {
    if (!on) return;
    var a = clips[kind];
    if (a) {
      try { a.currentTime = 0; var pr = a.play(); if (pr && pr.catch) pr.catch(function () { tone(kind); }); return; } catch (e) {}
    }
    tone(kind);
  }

  // Links: beep, then follow the link a moment later so the sound is heard.
  document.querySelectorAll(".big-btn, nav.top a, .logo").forEach(function (a) {
    a.addEventListener("click", function (ev) {
      if (!on || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
      ev.preventDefault();
      beep("go");
      var href = a.getAttribute("href");
      setTimeout(function () { location.href = href; }, 350);
    });
  });
  // Filter buttons: a single short beep.
  document.querySelectorAll("[data-show], .chip").forEach(function (b) {
    b.addEventListener("click", function () { beep("tap"); });
  });

  var toggle = document.getElementById("sound-toggle");
  if (toggle) {
    var label = function () { toggle.textContent = on ? "Sound: on" : "Sound: off"; toggle.setAttribute("aria-pressed", String(on)); };
    label();
    toggle.addEventListener("click", function () {
      on = !on; label();
      try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
      if (on) beep("tap");
    });
  }
})();
