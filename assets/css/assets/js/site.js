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
  if (["major", "samples", "abstracts", "certifications"].indexOf(start) > -1) state.show = start;
  apply();
})();
