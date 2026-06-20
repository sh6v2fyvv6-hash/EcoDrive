/* ============================================================
   EcoDrive — Données produits + logique panier (partagé)
   Exposé sur window.ECODRIVE
   ============================================================ */
(function () {
  "use strict";

  var PRODUCTS = [
    {
      id: "city",
      name: "AlgO2 City",
      category: "Citadine",
      sport: false,
      diameter: 50,
      price: 349,
      monthly: 29,
      tagline: "La petite bombe verte pour la ville 🌱",
      pitch: "Compact, léger, malin : AlgO2 City glisse sous votre citadine et transforme vos trajets urbains en bouffées d'air pur.",
      vehicles: ["Renault Clio", "Peugeot 208", "VW Polo", "Toyota Yaris", "Renault Twingo"],
      accent: "#00B6A6",
      icon: "🚗"
    },
    {
      id: "berline",
      name: "AlgO2 Berline",
      category: "Berline",
      sport: false,
      diameter: 60,
      price: 449,
      monthly: 34,
      tagline: "Le confort qui respire 💨",
      pitch: "Pensé pour les longs trajets : un équilibre parfait entre dépollution, silence et élégance sous votre berline.",
      vehicles: ["Renault Mégane", "Peugeot 308", "VW Golf", "BMW Série 3", "Audi A4"],
      accent: "#0A4DA2",
      icon: "🚙"
    },
    {
      id: "suv",
      name: "AlgO2 SUV",
      category: "SUV",
      sport: false,
      diameter: 63,
      price: 549,
      monthly: 39,
      tagline: "Du costaud qui dépollue fort 🌍",
      pitch: "Plus de volume, plus d'algues, plus d'impact : AlgO2 SUV avale le CO2 de vos grosses cylindrées familiales.",
      vehicles: ["Peugeot 3008", "VW Tiguan", "Nissan Qashqai", "BMW X3", "Dacia Duster"],
      accent: "#263238",
      icon: "🚐"
    },
    {
      id: "sport",
      name: "AlgO2 Sport",
      category: "Sport",
      sport: true,
      diameter: 76,
      price: 899,
      monthly: 59,
      tagline: "La performance qui a une conscience 🏁",
      pitch: "Inox poli, double sortie, son sculpté et algues haute densité : roulez fort, respirez juste. Le seul pot sport qui plante (presque) des arbres.",
      vehicles: ["VW Golf GTI", "Audi RS3", "Honda Civic Type R", "BMW M2", "Mercedes-AMG A45"],
      accent: "#00B6A6",
      icon: "🏎️"
    },
    {
      id: "van",
      name: "AlgO2 Van",
      category: "Utilitaire",
      sport: false,
      diameter: 89,
      price: 649,
      monthly: 44,
      tagline: "Les pros aussi méritent de l'air pur 🛠️",
      pitch: "Robuste et increvable, AlgO2 Van équipe vos utilitaires et flottes pour un reporting RSE qui brille.",
      vehicles: ["Renault Trafic", "VW Transporter", "Mercedes Sprinter", "Ford Transit", "Peugeot Expert"],
      accent: "#0A4DA2",
      icon: "🚚"
    }
  ];

  var CART_KEY = "ecodrive_cart";

  function getProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      var data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function addToCart(id, qty) {
    qty = qty || 1;
    if (!getProduct(id)) return;
    var cart = getCart();
    var found = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) { cart[i].qty += qty; found = true; break; }
    }
    if (!found) cart.push({ id: id, qty: qty });
    saveCart(cart);
  }

  function setQty(id, qty) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        cart[i].qty = Math.max(1, qty);
        break;
      }
    }
    saveCart(cart);
  }

  function removeFromCart(id) {
    var cart = getCart().filter(function (item) { return item.id !== id; });
    saveCart(cart);
  }

  function clearCart() { saveCart([]); }

  function cartCount() {
    return getCart().reduce(function (n, item) { return n + item.qty; }, 0);
  }

  function cartTotal() {
    return getCart().reduce(function (sum, item) {
      var p = getProduct(item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }

  function formatPrice(n) {
    return new Intl.NumberFormat("fr-FR").format(n) + " €";
  }

  window.ECODRIVE = {
    products: PRODUCTS,
    getProduct: getProduct,
    getCart: getCart,
    addToCart: addToCart,
    setQty: setQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    cartCount: cartCount,
    cartTotal: cartTotal,
    formatPrice: formatPrice
  };
})();
