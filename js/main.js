// ============================================================
//  EcoDrive — interactions communes + rendu des pages
// ============================================================
(function () {
  "use strict";

  var EC = window.ECODRIVE || null;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  // --- Année dynamique ---
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Menu mobile ---
  var toggle = $(".nav-toggle");
  var links = $(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // --- Badge panier (toutes les pages) ---
  function updateCartBadge() {
    if (!EC) return;
    var count = EC.cartCount();
    $all("[data-cart-count]").forEach(function (el) {
      el.textContent = count;
      el.classList.toggle("is-empty", count === 0);
    });
  }
  updateCartBadge();

  // --- Mini toast "ajouté au panier" ---
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { t.remove(); }, 300);
    }, 2200);
  }

  // ===================== CATALOGUE (produits.html) =====================
  var catalog = document.getElementById("catalog");
  if (catalog && EC) {
    function productCard(p) {
      return (
        '<article class="card product-card" data-cat="' + p.category + '" data-sport="' + p.sport + '">' +
          (p.sport ? '<span class="badge-sport">🏁 Édition Sport</span>' : "") +
          '<a class="product-media" href="produit.html?id=' + p.id + '" style="--accent:' + p.accent + '" aria-label="' + p.name + '">' +
            '<span class="product-emoji">' + p.icon + '</span>' +
            '<span class="product-diam">Ø ' + p.diameter + " mm</span>" +
          "</a>" +
          '<div class="product-body">' +
            '<span class="product-cat">' + p.category + "</span>" +
            '<h3><a href="produit.html?id=' + p.id + '">' + p.name + "</a></h3>" +
            '<p class="product-tagline">' + p.tagline + "</p>" +
            '<div class="product-foot">' +
              '<span class="product-price">' + EC.formatPrice(p.price) + "</span>" +
              '<button class="btn btn-primary btn-sm" data-add="' + p.id + '">Ajouter</button>' +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }

    function render(filter) {
      var list = EC.products.filter(function (p) {
        if (filter === "all" || !filter) return true;
        if (filter === "sport") return p.sport;
        return p.category === filter;
      });
      catalog.innerHTML = list.map(productCard).join("");
    }

    render("all");

    $all(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $all(".filter-btn").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        render(btn.getAttribute("data-filter"));
      });
    });

    catalog.addEventListener("click", function (e) {
      var add = e.target.closest("[data-add]");
      if (!add) return;
      EC.addToCart(add.getAttribute("data-add"), 1);
      updateCartBadge();
      toast("Ajouté au panier 🛒");
    });
  }

  // ===================== FICHE PRODUIT (produit.html) =====================
  var detail = document.getElementById("productDetail");
  if (detail && EC) {
    var params = new URLSearchParams(window.location.search);
    var p = EC.getProduct(params.get("id")) || EC.products[0];
    document.title = p.name + " — EcoDrive";

    var crumb = document.getElementById("pdCrumb");
    if (crumb) crumb.textContent = p.name;

    detail.innerHTML =
      '<div class="pd-media" style="--accent:' + p.accent + '">' +
        (p.sport ? '<span class="badge-sport">🏁 Édition Sport</span>' : "") +
        '<span class="pd-emoji">' + p.icon + "</span>" +
        '<span class="product-diam">Ø ' + p.diameter + " mm</span>" +
      "</div>" +
      '<div class="pd-info">' +
        '<span class="product-cat">' + p.category + "</span>" +
        "<h1>" + p.name + "</h1>" +
        '<p class="pd-tagline">' + p.tagline + "</p>" +
        "<p>" + p.pitch + "</p>" +
        '<ul class="pd-specs">' +
          "<li><span>Diamètre</span><strong>Ø " + p.diameter + " mm</strong></li>" +
          "<li><span>Catégorie</span><strong>" + p.category + "</strong></li>" +
          "<li><span>Algues</span><strong>Renouvelées tous les 6 mois</strong></li>" +
          "<li><span>Garantie</span><strong>Sérénité 5 ans</strong></li>" +
        "</ul>" +
        '<div class="pd-vehicles"><strong>Compatible notamment :</strong> ' + p.vehicles.join(" · ") + "</div>" +
        '<div class="pd-buy">' +
          '<div class="pd-price"><strong>' + EC.formatPrice(p.price) + '</strong><small>ou ' + p.monthly + "€/mois en abonnement</small></div>" +
          '<div class="qty" role="group" aria-label="Quantité">' +
            '<button type="button" data-step="-1" aria-label="Diminuer">−</button>' +
            '<input id="pdQty" type="number" min="1" value="1" inputmode="numeric" />' +
            '<button type="button" data-step="1" aria-label="Augmenter">+</button>' +
          "</div>" +
          '<button class="btn btn-primary" id="pdAdd">Ajouter au panier 🛒</button>' +
        "</div>" +
        '<p class="pd-cheese">⭐️ Le choix de milliers de conducteurs heureux. Vos poumons valident.</p>' +
      "</div>";

    var qtyInput = document.getElementById("pdQty");
    detail.addEventListener("click", function (e) {
      var step = e.target.closest("[data-step]");
      if (step) {
        var v = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = Math.max(1, v + parseInt(step.getAttribute("data-step"), 10));
      }
    });
    var pdAdd = document.getElementById("pdAdd");
    if (pdAdd) pdAdd.addEventListener("click", function () {
      EC.addToCart(p.id, Math.max(1, parseInt(qtyInput.value, 10) || 1));
      updateCartBadge();
      toast("Ajouté au panier 🛒");
    });

    // Produits similaires
    var related = document.getElementById("relatedGrid");
    if (related) {
      related.innerHTML = EC.products.filter(function (x) { return x.id !== p.id; }).slice(0, 3).map(function (x) {
        return '<a class="related-card" href="produit.html?id=' + x.id + '" style="--accent:' + x.accent + '">' +
          '<span class="related-emoji">' + x.icon + "</span>" +
          "<strong>" + x.name + "</strong>" +
          "<span>" + EC.formatPrice(x.price) + "</span>" +
        "</a>";
      }).join("");
    }
  }

  // ===================== PANIER (panier.html) =====================
  var cartRoot = document.getElementById("cart");
  if (cartRoot && EC) {
    function renderCart() {
      var cart = EC.getCart();
      if (!cart.length) {
        cartRoot.innerHTML =
          '<div class="cart-empty">' +
            "<p class=\"cart-empty-emoji\">🛒</p>" +
            "<h2>Votre panier est tout vide</h2>" +
            "<p>Il a soif d'air pur ! Découvrez nos modèles AlgO2.</p>" +
            '<a class="btn btn-primary" href="produits.html">Voir les produits</a>' +
          "</div>";
        return;
      }

      var rows = cart.map(function (item) {
        var p = EC.getProduct(item.id);
        if (!p) return "";
        return (
          '<div class="cart-row" data-id="' + p.id + '">' +
            '<div class="cart-prod">' +
              '<span class="cart-emoji" style="--accent:' + p.accent + '">' + p.icon + "</span>" +
              "<div><strong>" + p.name + "</strong><small>" + p.category + " · Ø " + p.diameter + " mm</small></div>" +
            "</div>" +
            '<div class="cart-unit">' + EC.formatPrice(p.price) + "</div>" +
            '<div class="qty" role="group" aria-label="Quantité ' + p.name + '">' +
              '<button type="button" data-dec aria-label="Diminuer">−</button>' +
              '<input type="number" min="1" value="' + item.qty + '" data-qty aria-label="Quantité" />' +
              '<button type="button" data-inc aria-label="Augmenter">+</button>' +
            "</div>" +
            '<div class="cart-line">' + EC.formatPrice(p.price * item.qty) + "</div>" +
            '<button class="cart-remove" data-remove aria-label="Retirer ' + p.name + '">✕</button>' +
          "</div>"
        );
      }).join("");

      cartRoot.innerHTML =
        '<div class="cart-table">' +
          '<div class="cart-head"><span>Produit</span><span>Prix</span><span>Quantité</span><span>Total</span><span></span></div>' +
          rows +
        "</div>" +
        '<aside class="cart-summary card">' +
          "<h3>Récapitulatif</h3>" +
          '<div class="cart-sum-row"><span>Sous-total</span><strong>' + EC.formatPrice(EC.cartTotal()) + "</strong></div>" +
          '<div class="cart-sum-row"><span>Installation</span><strong class="free">Offerte</strong></div>' +
          '<div class="cart-sum-row"><span>Livraison</span><strong class="free">Gratuite</strong></div>' +
          '<div class="cart-sum-total"><span>Total</span><strong>' + EC.formatPrice(EC.cartTotal()) + "</strong></div>" +
          '<button class="btn btn-primary btn-block" id="checkout">Commander 🚀</button>' +
          '<button class="btn btn-ghost btn-block" id="clearCart">Vider le panier</button>' +
          '<p class="summary-note">Paiement fictif — projet de démonstration.</p>' +
        "</aside>";
    }

    renderCart();

    cartRoot.addEventListener("click", function (e) {
      var row = e.target.closest(".cart-row");
      if (e.target.closest("#clearCart")) { EC.clearCart(); renderCart(); updateCartBadge(); return; }
      if (e.target.closest("#checkout")) {
        EC.clearCart(); updateCartBadge();
        cartRoot.innerHTML = '<div class="cart-empty"><p class="cart-empty-emoji">🎉</p><h2>Merci pour votre commande !</h2><p>Vos poumons vous remercient déjà. (Commande fictive de démonstration.)</p><a class="btn btn-primary" href="produits.html">Continuer mes achats</a></div>';
        return;
      }
      if (!row) return;
      var id = row.getAttribute("data-id");
      var input = row.querySelector("[data-qty]");
      if (e.target.closest("[data-remove]")) { EC.removeFromCart(id); renderCart(); updateCartBadge(); return; }
      if (e.target.closest("[data-inc]")) { EC.setQty(id, (parseInt(input.value, 10) || 1) + 1); renderCart(); updateCartBadge(); }
      if (e.target.closest("[data-dec]")) { EC.setQty(id, (parseInt(input.value, 10) || 1) - 1); renderCart(); updateCartBadge(); }
    });

    cartRoot.addEventListener("change", function (e) {
      var input = e.target.closest("[data-qty]");
      if (!input) return;
      var row = e.target.closest(".cart-row");
      EC.setQty(row.getAttribute("data-id"), parseInt(input.value, 10) || 1);
      renderCart();
      updateCartBadge();
    });
  }

  // ===================== Aperçu produits sur l'accueil =====================
  var home = document.getElementById("homeProducts");
  if (home && EC) {
    home.innerHTML = EC.products.slice(0, 3).map(function (p) {
      return '<a class="card home-prod" href="produit.html?id=' + p.id + '" style="--accent:' + p.accent + '">' +
        '<span class="home-prod-emoji">' + p.icon + "</span>" +
        "<h3>" + p.name + "</h3>" +
        '<span class="product-cat">' + p.category + "</span>" +
        '<span class="product-price">' + EC.formatPrice(p.price) + "</span>" +
      "</a>";
    }).join("");
  }

  // ===================== Formulaire de contact =====================
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
