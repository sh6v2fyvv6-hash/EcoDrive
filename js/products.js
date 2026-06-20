/* ============================================================
   EcoDrive — Données produits, visuel SVG + logique panier
   Exposé sur window.ECODRIVE
   ============================================================ */
(function () {
  "use strict";

  // --- Pots d'échappement (achat unique, 1 filtre inclus) ---
  var PRODUCTS = [
    {
      id: "city", name: "AlgO2 City", category: "Citadine", type: "pot", sport: false,
      diameter: 50, price: 349, tagline: "La petite bombe verte pour la ville 🌱",
      pitch: "Compact, léger, malin : AlgO2 City glisse sous votre citadine et transforme vos trajets urbains en bouffées d'air pur. Livré avec sa première cartouche d'algues.",
      vehicles: ["Renault Clio", "Peugeot 208", "VW Polo", "Toyota Yaris", "Renault Twingo"],
      accent: "#00B6A6", icon: "🚗"
    },
    {
      id: "berline", name: "AlgO2 Berline", category: "Berline", type: "pot", sport: false,
      diameter: 60, price: 449, tagline: "Le confort qui respire 💨",
      pitch: "Pensé pour les longs trajets : un équilibre parfait entre dépollution, silence et élégance sous votre berline. Première cartouche d'algues incluse.",
      vehicles: ["Renault Mégane", "Peugeot 308", "VW Golf", "BMW Série 3", "Audi A4"],
      accent: "#0A4DA2", icon: "🚙"
    },
    {
      id: "suv", name: "AlgO2 SUV", category: "SUV", type: "pot", sport: false,
      diameter: 63, price: 549, tagline: "Du costaud qui dépollue fort 🌍",
      pitch: "Plus de volume, plus d'algues, plus d'impact : AlgO2 SUV avale le CO2 de vos grosses cylindrées familiales. Première cartouche d'algues incluse.",
      vehicles: ["Peugeot 3008", "VW Tiguan", "Nissan Qashqai", "BMW X3", "Dacia Duster"],
      accent: "#263238", icon: "🚐"
    },
    {
      id: "sport", name: "AlgO2 Sport", category: "Sport", type: "pot", sport: true,
      diameter: 76, price: 899, tagline: "La performance qui a une conscience 🏁",
      pitch: "Inox poli, double sortie, son sculpté et cartouche d'algues haute densité : roulez fort, respirez juste. Le seul pot sport qui plante (presque) des arbres. Première cartouche incluse.",
      vehicles: ["VW Golf GTI", "Audi RS3", "Honda Civic Type R", "BMW M2", "Mercedes-AMG A45"],
      accent: "#00B6A6", icon: "🏎️"
    },
    {
      id: "van", name: "AlgO2 Van", category: "Utilitaire", type: "pot", sport: false,
      diameter: 89, price: 649, tagline: "Les pros aussi méritent de l'air pur 🛠️",
      pitch: "Robuste et increvable, AlgO2 Van équipe vos utilitaires et flottes pour un reporting RSE qui brille. Première cartouche d'algues incluse.",
      vehicles: ["Renault Trafic", "VW Transporter", "Mercedes Sprinter", "Ford Transit", "Peugeot Expert"],
      accent: "#0A4DA2", icon: "🚚"
    },

    // --- Cartouche filtrante (achat à l'unité) ---
    {
      id: "cartouche", name: "Cartouche filtrante AlgO2", category: "Filtre", type: "filtre", sport: false,
      price: 24, tagline: "Le cœur vivant de votre pot 🌿",
      pitch: "La cartouche d'algues qui capture le CO2 et libère l'O2. À remplacer chaque mois pour des performances optimales. Vendue à l'unité — ou en illimité avec l'abonnement.",
      vehicles: ["Compatible tous les modèles AlgO2"],
      accent: "#00B6A6", icon: "🧪"
    },

    // --- Abonnement filtres (mensuel récurrent) ---
    {
      id: "abo-filtres", name: "Abonnement Filtres", category: "Abonnement", type: "abo", sport: false,
      price: 0, monthly: 19, tagline: "Des filtres frais chaque mois, sans y penser 📦",
      pitch: "On vous livre une cartouche d'algues fraîche tous les mois, automatiquement. Zéro oubli, performances toujours au top, et c'est moins cher qu'à l'unité. Résiliable à tout moment.",
      vehicles: ["Compatible tous les modèles AlgO2"],
      accent: "#0A4DA2", icon: "♻️"
    }
  ];

  // --- Visuel SVG d'un pot d'échappement (corps inox + cartouche d'algues) ---
  function potSVG(accent, sport) {
    accent = accent || "#00B6A6";
    var tips = sport
      ? '<rect x="160" y="40" width="54" height="14" rx="7" fill="#9aa4a9"/>' +
        '<rect x="160" y="66" width="54" height="14" rx="7" fill="#9aa4a9"/>' +
        '<rect x="205" y="37" width="10" height="20" rx="3" fill="#cfd6da"/>' +
        '<rect x="205" y="63" width="10" height="20" rx="3" fill="#cfd6da"/>'
      : '<rect x="160" y="50" width="55" height="20" rx="10" fill="#9aa4a9"/>' +
        '<rect x="206" y="46" width="10" height="28" rx="3" fill="#cfd6da"/>';
    return (
      '<svg class="pot-svg" viewBox="0 0 230 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pot d\'échappement AlgO2">' +
        '<rect x="2" y="51" width="62" height="18" rx="9" fill="#9aa4a9"/>' +
        tips +
        '<rect x="50" y="26" width="120" height="68" rx="22" fill="#b9c2c7"/>' +
        '<rect x="52" y="30" width="116" height="12" rx="6" fill="#d4dbdf" opacity=".75"/>' +
        '<rect x="58" y="34" width="104" height="52" rx="14" fill="none" stroke="#8e989d" stroke-width="2"/>' +
        '<rect x="116" y="40" width="34" height="40" rx="8" fill="' + accent + '"/>' +
        '<circle cx="127" cy="52" r="3.2" fill="#fff" opacity=".85"/>' +
        '<circle cx="139" cy="62" r="2.4" fill="#fff" opacity=".7"/>' +
        '<circle cx="131" cy="71" r="2" fill="#fff" opacity=".6"/>' +
        '<path d="M150 37 q11 -7 5 -19 q-3 13 -11 12 z" fill="' + accent + '"/>' +
      "</svg>"
    );
  }

  var CART_KEY = "ecodrive_cart";

  function getProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function pots() { return PRODUCTS.filter(function (p) { return p.type === "pot"; }); }

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      var data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (e) { return []; }
  }
  function saveCart(cart) { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }

  function addToCart(id, qty) {
    qty = qty || 1;
    if (!getProduct(id)) return;
    var cart = getCart(), found = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) { cart[i].qty += qty; found = true; break; }
    }
    if (!found) cart.push({ id: id, qty: qty });
    saveCart(cart);
  }
  function setQty(id, qty) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) if (cart[i].id === id) { cart[i].qty = Math.max(1, qty); break; }
    saveCart(cart);
  }
  function removeFromCart(id) {
    saveCart(getCart().filter(function (item) { return item.id !== id; }));
  }
  function clearCart() { saveCart([]); }

  function cartCount() {
    return getCart().reduce(function (n, item) { return n + item.qty; }, 0);
  }
  function cartTotals() {
    var oneTime = 0, monthly = 0;
    getCart().forEach(function (item) {
      var p = getProduct(item.id);
      if (!p) return;
      if (p.type === "abo") monthly += (p.monthly || 0) * item.qty;
      else oneTime += (p.price || 0) * item.qty;
    });
    return { oneTime: oneTime, monthly: monthly };
  }
  function formatPrice(n) { return new Intl.NumberFormat("fr-FR").format(n) + " €"; }

  window.ECODRIVE = {
    products: PRODUCTS,
    pots: pots,
    potSVG: potSVG,
    getProduct: getProduct,
    getCart: getCart,
    addToCart: addToCart,
    setQty: setQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    cartCount: cartCount,
    cartTotals: cartTotals,
    formatPrice: formatPrice
  };
})();
