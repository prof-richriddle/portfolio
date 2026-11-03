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
