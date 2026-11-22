(function () {
  // Dark mode toggle (every page). Follows the device until the visitor picks.
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return !!(media && media.matches);
  }
  function label() {
    var dark = isDark();
    btn.querySelector("span").textContent = dark ? "Light mode" : "Dark mode";
  }
  btn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    label();
  });
  if (media && media.addEventListener) media.addEventListener("change", label);
  label();
})();

(function () {
  // Any page with Show buttons: type buttons, plus topic filters where they exist.
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
  if (start === "abstracts") start = "coursework";
  if (start && document.querySelector('[data-show="' + start + '"]')) state.show = start;
  apply();
})();

// About Me: rotate portraits every 3 seconds, with a pause button
(function () {
  var fig = document.querySelector(".portraits");
  if (!fig) return;
  var imgs = fig.querySelectorAll(".portraits-frame img");
  var btn = fig.querySelector(".portraits-pause");
  if (imgs.length < 2) { if (btn) btn.hidden = true; return; }
  var i = 0, timer = null;
  function next() {
    imgs[i].classList.remove("on");
    i = (i + 1) % imgs.length;
    imgs[i].classList.add("on");
  }
  function play() { timer = setInterval(next, 3000); btn.textContent = "Pause photos"; btn.setAttribute("aria-pressed", "false"); }
  function stop() { clearInterval(timer); timer = null; btn.textContent = "Play photos"; btn.setAttribute("aria-pressed", "true"); }
  btn.addEventListener("click", function () { timer ? stop() : play(); });
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) stop(); else play();
})();

// Writing sample pages: "Back to Portfolio" returns visitors to the exact view
// they left (same filter, same spot) when they came from the Portfolio page.
// Otherwise the link opens Portfolio at the writing samples.
(function () {
  var link = document.querySelector("a.back-link");
  if (!link) return;
  link.addEventListener("click", function (e) {
    try {
      var ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.origin === location.origin && /\/portfolio\.html$/.test(ref.pathname) && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    } catch (err) {}
  });
})();
