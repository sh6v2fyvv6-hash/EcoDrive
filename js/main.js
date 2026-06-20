// ============================================================
//  EcoDrive — interactions de base
// ============================================================
(function () {
  "use strict";

  // --- Année dynamique dans le footer ---
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Menu mobile ---
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Fermer le menu après un clic sur un lien
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // --- Configurateur AlgO2 (diamètre + algues) ---
  var diameters = document.querySelectorAll(".diameter");
  var algaeRadios = document.querySelectorAll('input[name="algae"]');
  var sumDiam = document.getElementById("sumDiam");
  var sumType = document.getElementById("sumType");
  var sumPrice = document.getElementById("sumPrice");
  var sumAlgae = document.getElementById("sumAlgae");

  function updateSummary() {
    var active = document.querySelector(".diameter.is-active");
    if (!active || !sumDiam) return;

    var base = parseInt(active.getAttribute("data-price"), 10);
    sumDiam.textContent = "Ø " + active.getAttribute("data-d") + " mm";
    sumType.textContent = "Idéal pour : " + active.getAttribute("data-type");

    // Renouvellement tous les 6 mois = +5€/mois (algues toujours fraîches)
    var checked = document.querySelector('input[name="algae"]:checked');
    var every = checked ? checked.value : "6";
    var price = every === "6" ? base : Math.max(base - 5, 0);

    sumPrice.textContent = price;
    sumAlgae.textContent = every === "6" ? "tous les 6 mois" : "tous les 12 mois";
  }

  diameters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      diameters.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      updateSummary();
    });
  });
  algaeRadios.forEach(function (r) { r.addEventListener("change", updateSummary); });
  updateSummary();

  // --- Formulaire de contact (démo, sans backend) ---
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !message) {
        status.textContent = "Merci de remplir tous les champs avec un email valide.";
        status.className = "form-status err";
        return;
      }

      status.textContent = "Merci " + name + " ! Votre message a bien été envoyé.";
      status.className = "form-status ok";
      form.reset();
    });
  }
})();
