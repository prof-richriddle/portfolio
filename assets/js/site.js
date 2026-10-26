(function () {
  var NOTES = {
    everyone: "Everything on the site, top to bottom.",
    family: "The short version: what I do, how a project grows, and what has come of it.",
    peers: "Research, studies, every abstract, and my human subjects training."
  };
  var viewBtns = document.querySelectorAll(".seg button");
  var blocks = document.querySelectorAll("[data-views]");
  function setView(v, push) {
    if (!NOTES[v]) v = "everyone";
    viewBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.view === v)); });
    blocks.forEach(function (el) {
      var list = el.dataset.views.split(" ");
      el.hidden = !(v === "everyone" || list.indexOf(v) > -1);
    });
    document.getElementById("view-note").textContent = NOTES[v];
    if (push) { try { history.replaceState(null, "", "#" + v); } catch (e) {} }
  }
  viewBtns.forEach(function (b) { b.addEventListener("click", function () { setView(b.dataset.view, true); }); });

  document.querySelectorAll("nav.top a").forEach(function (a) {
    a.addEventListener("click", function () {
      var t = document.querySelector(a.getAttribute("href"));
      if (t && t.hidden) setView("everyone", false);
    });
  });

  var chips = document.querySelectorAll(".chip");
  var tiles = document.querySelectorAll(".tile");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      var t = c.dataset.topic;
      chips.forEach(function (x) { x.setAttribute("aria-pressed", String(x === c)); });
      tiles.forEach(function (el) { el.hidden = !(t === "all" || el.dataset.topic === t); });
    });
  });

  var start = (location.hash || "").replace("#", "");
  setView(NOTES[start] ? start : "everyone", false);
})();
