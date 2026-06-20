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
  var toggle = $(".nav-toggle"), links = $(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  // --- Badge panier ---
  function updateCartBadge() {
    if (!EC) return;
    var count = EC.cartCount();
    $all("[data-cart-count]").forEach(function (el) {
      el.textContent = count;
      el.classList.toggle("is-empty", count === 0);
    });
  }
  updateCartBadge();

  // --- Toast ---
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 300); }, 2200);
  }

  // --- Ajout au panier global (boutons data-add / data-sub) ---
  if (EC) {
    document.addEventListener("click", function (e) {
      var add = e.target.closest("[data-add]");
      var sub = e.target.closest("[data-sub]");
      if (add) { EC.addToCart(add.getAttribute("data-add"), 1); updateCartBadge(); toast("Ajouté au panier 🛒"); }
      else if (sub) { EC.addToCart(sub.getAttribute("data-sub"), 1); updateCartBadge(); toast("Abonnement ajouté 📦"); }
    });
  }

  // ===================== CATALOGUE (produits.html) =====================
  var catalog = document.getElementById("catalog");
  if (catalog && EC) {
    function productCard(p) {
      return (
        '<article class="card product-card" data-cat="' + p.category + '" data-sport="' + p.sport + '">' +
          (p.sport ? '<span class="badge-sport">🏁 Édition Sport</span>' : "") +
          '<a class="product-media" href="produit.html?id=' + p.id + '" style="--accent:' + p.accent + '" aria-label="' + p.name + '">' +
            EC.potSVG(p.accent, p.sport) +
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
      var list = EC.pots().filter(function (p) {
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
  }

  // ===================== FICHE PRODUIT (produit.html) =====================
  var detail = document.getElementById("productDetail");
  if (detail && EC) {
    var params = new URLSearchParams(window.location.search);
    var p = EC.getProduct(params.get("id")) || EC.pots()[0];
    document.title = p.name + " — EcoDrive";
    var crumb = document.getElementById("pdCrumb");
    if (crumb) crumb.textContent = p.name;

    var media = (p.type === "pot")
      ? '<div class="pd-media" style="--accent:' + p.accent + '">' +
          (p.sport ? '<span class="badge-sport">🏁 Édition Sport</span>' : "") +
          EC.potSVG(p.accent, p.sport) +
          '<span class="product-diam">Ø ' + p.diameter + " mm</span>" +
        "</div>"
      : '<div class="pd-media" style="--accent:' + p.accent + '"><span class="pd-emoji">' + p.icon + "</span></div>";

    var specs;
    if (p.type === "pot") {
      specs =
        "<li><span>Diamètre</span><strong>Ø " + p.diameter + " mm</strong></li>" +
        "<li><span>Catégorie</span><strong>" + p.category + "</strong></li>" +
        "<li><span>Filtre</span><strong>1 cartouche incluse</strong></li>" +
        "<li><span>Garantie</span><strong>Sérénité 5 ans</strong></li>";
    } else if (p.type === "filtre") {
      specs =
        "<li><span>Type</span><strong>Cartouche d'algues</strong></li>" +
        "<li><span>Durée</span><strong>~1 mois</strong></li>" +
        "<li><span>Compatibilité</span><strong>Tous modèles AlgO2</strong></li>" +
        "<li><span>Recyclage</span><strong>100% compostable</strong></li>";
    } else {
      specs =
        "<li><span>Livraison</span><strong>1 cartouche / mois</strong></li>" +
        "<li><span>Engagement</span><strong>Aucun, résiliable</strong></li>" +
        "<li><span>Économie</span><strong>−21% vs à l'unité</strong></li>" +
        "<li><span>Compatibilité</span><strong>Tous modèles AlgO2</strong></li>";
    }

    // Bloc d'achat selon le type
    var buy;
    if (p.type === "abo") {
      buy =
        '<div class="pd-buy">' +
          '<div class="pd-price"><strong>' + p.monthly + "€<small>/mois</small></strong><small>résiliable à tout moment</small></div>" +
          '<button class="btn btn-primary" data-sub="abo-filtres">S\'abonner 📦</button>' +
        "</div>";
    } else {
      var aboBlock = (p.type === "pot")
        ? '<fieldset class="pd-abo">' +
            "<legend>Filtres &amp; entretien 🌿</legend>" +
            '<label class="abo-opt"><input type="radio" name="abo" value="none" checked> ' +
              "<span><strong>Achat seul</strong> — pot + 1 filtre inclus<small>Vous rachetez vos cartouches à l'unité (24&nbsp;€) quand vous voulez.</small></span></label>" +
            '<label class="abo-opt"><input type="radio" name="abo" value="sub"> ' +
              "<span><strong>+ Abonnement Filtres</strong> <em>+19&nbsp;€/mois</em><small>Une cartouche fraîche livrée chaque mois, automatiquement. Résiliable à tout moment.</small></span></label>" +
          "</fieldset>"
        : "";
      buy =
        aboBlock +
        '<div class="pd-buy">' +
          '<div class="pd-price"><strong>' + EC.formatPrice(p.price) + "</strong>" +
            (p.type === "pot" ? "<small>1 cartouche d'algues incluse</small>" : "<small>à l'unité</small>") + "</div>" +
          '<div class="qty" role="group" aria-label="Quantité">' +
            '<button type="button" data-step="-1" aria-label="Diminuer">−</button>' +
            '<input id="pdQty" type="number" min="1" value="1" inputmode="numeric" />' +
            '<button type="button" data-step="1" aria-label="Augmenter">+</button>' +
          "</div>" +
          '<button class="btn btn-primary" id="pdAdd">Ajouter au panier 🛒</button>' +
        "</div>";
    }

    detail.innerHTML =
      media +
      '<div class="pd-info">' +
        '<span class="product-cat">' + p.category + "</span>" +
        "<h1>" + p.name + "</h1>" +
        '<p class="pd-tagline">' + p.tagline + "</p>" +
        "<p>" + p.pitch + "</p>" +
        '<ul class="pd-specs">' + specs + "</ul>" +
        '<div class="pd-vehicles"><strong>' + (p.type === "pot" ? "Compatible notamment :" : "Compatibilité :") + "</strong> " + p.vehicles.join(" · ") + "</div>" +
        buy +
        '<p class="pd-cheese">⭐️ Le choix de milliers de conducteurs heureux. Vos poumons valident.</p>' +
      "</div>";

    // Quantité + ajout
    var qtyInput = document.getElementById("pdQty");
    detail.addEventListener("click", function (e) {
      var step = e.target.closest("[data-step]");
      if (step && qtyInput) {
        var v = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = Math.max(1, v + parseInt(step.getAttribute("data-step"), 10));
      }
    });
    var pdAdd = document.getElementById("pdAdd");
    if (pdAdd) pdAdd.addEventListener("click", function () {
      var qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
      EC.addToCart(p.id, qty);
      var aboChecked = $('input[name="abo"]:checked');
      if (aboChecked && aboChecked.value === "sub") {
        EC.addToCart("abo-filtres", 1);
        toast("Pot + abonnement ajoutés 🛒📦");
      } else {
        toast("Ajouté au panier 🛒");
      }
      updateCartBadge();
    });

    // Produits similaires (pots)
    var related = document.getElementById("relatedGrid");
    if (related) {
      related.innerHTML = EC.pots().filter(function (x) { return x.id !== p.id; }).slice(0, 3).map(function (x) {
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
          '<div class="cart-empty"><p class="cart-empty-emoji">🛒</p><h2>Votre panier est tout vide</h2>' +
          "<p>Il a soif d'air pur ! Découvrez nos modèles AlgO2.</p>" +
          '<a class="btn btn-primary" href="produits.html">Voir les produits</a></div>';
        return;
      }

      var rows = cart.map(function (item) {
        var p = EC.getProduct(item.id);
        if (!p) return "";
        var isAbo = p.type === "abo";
        var unit = isAbo ? (p.monthly + "€/mois") : EC.formatPrice(p.price);
        var line = isAbo ? (p.monthly * item.qty + "€/mois") : EC.formatPrice(p.price * item.qty);
        var sub = isAbo ? "Abonnement mensuel" : (p.type === "filtre" ? "Cartouche d'algues" : (p.category + " · Ø " + p.diameter + " mm"));
        return (
          '<div class="cart-row" data-id="' + p.id + '">' +
            '<div class="cart-prod"><span class="cart-emoji" style="--accent:' + p.accent + '">' + p.icon + "</span>" +
              "<div><strong>" + p.name + "</strong><small>" + sub + "</small></div></div>" +
            '<div class="cart-unit">' + unit + "</div>" +
            '<div class="qty" role="group" aria-label="Quantité ' + p.name + '">' +
              '<button type="button" data-dec aria-label="Diminuer">−</button>' +
              '<input type="number" min="1" value="' + item.qty + '" data-qty aria-label="Quantité" />' +
              '<button type="button" data-inc aria-label="Augmenter">+</button>' +
            "</div>" +
            '<div class="cart-line">' + line + "</div>" +
            '<button class="cart-remove" data-remove aria-label="Retirer ' + p.name + '">✕</button>' +
          "</div>"
        );
      }).join("");

      var t = EC.cartTotals();
      var monthlyRow = t.monthly > 0
        ? '<div class="cart-sum-month"><span>Puis chaque mois <small>(abonnement filtres)</small></span><strong>' + t.monthly + "€/mois</strong></div>"
        : "";

      cartRoot.innerHTML =
        '<div class="cart-table">' +
          '<div class="cart-head"><span>Produit</span><span>Prix</span><span>Quantité</span><span>Total</span><span></span></div>' +
          rows +
        "</div>" +
        '<aside class="cart-summary card">' +
          "<h3>Récapitulatif</h3>" +
          '<div class="cart-sum-row"><span>Sous-total</span><strong>' + EC.formatPrice(t.oneTime) + "</strong></div>" +
          '<div class="cart-sum-row"><span>Installation</span><strong class="free">Offerte</strong></div>' +
          '<div class="cart-sum-row"><span>Livraison</span><strong class="free">Gratuite</strong></div>' +
          '<div class="cart-sum-total"><span>À payer aujourd\'hui</span><strong>' + EC.formatPrice(t.oneTime) + "</strong></div>" +
          monthlyRow +
          '<button class="btn btn-primary btn-block" id="checkout">Commander 🚀</button>' +
          '<button class="btn btn-ghost btn-block" id="clearCart">Vider le panier</button>' +
          '<p class="summary-note">Paiement fictif — projet de démonstration.</p>' +
        "</aside>";
    }
    renderCart();

    cartRoot.addEventListener("click", function (e) {
      if (e.target.closest("#clearCart")) { EC.clearCart(); renderCart(); updateCartBadge(); return; }
      if (e.target.closest("#checkout")) {
        EC.clearCart(); updateCartBadge();
        cartRoot.innerHTML = '<div class="cart-empty"><p class="cart-empty-emoji">🎉</p><h2>Merci pour votre commande !</h2><p>Vos poumons vous remercient déjà. (Commande fictive de démonstration.)</p><a class="btn btn-primary" href="produits.html">Continuer mes achats</a></div>';
        return;
      }
      var row = e.target.closest(".cart-row");
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
      renderCart(); updateCartBadge();
    });
  }

  // ===================== Aperçu produits (accueil) =====================
  var home = document.getElementById("homeProducts");
  if (home && EC) {
    home.innerHTML = EC.pots().slice(0, 3).map(function (p) {
      return '<a class="card home-prod" href="produit.html?id=' + p.id + '" style="--accent:' + p.accent + '">' +
        '<span class="home-prod-emoji">' + p.icon + "</span>" +
        "<h3>" + p.name + "</h3>" +
        '<span class="product-cat">' + p.category + "</span>" +
        '<span class="product-price">' + EC.formatPrice(p.price) + "</span>" +
      "</a>";
    }).join("");
  }

  // ===================== Formulaire de contact =====================
  var form = document.getElementById("contactForm"), status = document.getElementById("formStatus");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), email = form.email.value.trim(), message = form.message.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !emailOk || !message) {
        status.textContent = "Merci de remplir tous les champs avec un email valide.";
        status.className = "form-status err"; return;
      }
      status.textContent = "Merci " + name + " ! Votre message a bien été envoyé.";
      status.className = "form-status ok"; form.reset();
    });
  }
})();
