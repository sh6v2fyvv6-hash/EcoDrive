# EcoDrive — Site vitrine

> **Clean Energy. Clean Oceans. Better Future.**

Site web statique de la start-up fictive **EcoDrive** et de son produit **AlgO2**
(*Algae-Based Clean Energy Solution*), réalisé dans le cadre d'un projet académique
(brief, cahier des charges, identité visuelle et site web).

## 🌱 Le projet

EcoDrive est une start-up de **mobilité durable et de technologie verte**.
Son produit **AlgO2** est une solution embarquée qui exploite les micro-algues pour
**capturer le CO₂**, **libérer de l'O₂** et **récupérer de l'énergie** habituellement perdue.

## 🎨 Charte graphique

| Élément | Valeur |
|---|---|
| Deep Blue (confiance) | `#0A4DA2` |
| Aqua Green (nature) | `#00B6A6` |
| Charcoal Gray (force) | `#263238` |
| White (clarté) | `#FFFFFF` |
| Titres | Poppins (SemiBold) |
| Texte | Montserrat (Regular) |

## 📂 Structure (site multi-pages)

```
.
├── index.html          # Présentation (accueil)
├── produits.html       # Catalogue : la gamme AlgO2 + filtres
├── produit.html        # Fiche produit dynamique (?id=city|berline|suv|sport|van)
├── panier.html         # Panier (localStorage)
├── contact.html        # Contact
├── cgu.html            # Conditions générales (fictives)
├── css/style.css       # Styles + charte graphique + responsive
├── js/
│   ├── products.js     # Données produits + logique panier (window.ECODRIVE)
│   └── main.js         # Nav, badge panier, rendu catalogue/fiche/panier, formulaire
└── assets/
    └── logo-ecodrive.svg
```

### Gamme AlgO2 (par modèle de véhicule)

| Modèle | Véhicule | Ø | Prix |
|---|---|---|---|
| AlgO2 City | Citadine | 50 mm | 349 € |
| AlgO2 Berline | Berline / compacte | 60 mm | 449 € |
| AlgO2 SUV | SUV / familiale | 63 mm | 549 € |
| **AlgO2 Sport** | **Sportive** | **76 mm** | **899 €** |
| AlgO2 Van | Utilitaire | 89 mm | 649 € |

> Le **panier** est conservé localement dans le navigateur (`localStorage`) : aucune donnée n'est envoyée à un serveur. Tout est **fictif** (prix, garanties, avis) — projet académique.

## ▶️ Lancer en local

Aucune dépendance. Ouvrez simplement `index.html` dans un navigateur, ou servez le dossier :

```bash
python3 -m http.server 8080
# puis ouvrez http://localhost:8080
```

## 🚀 Déploiement (hébergement gratuit)

Le site étant 100 % statique, il se déploie tel quel sur :

- **GitHub Pages** : Settings → Pages → branche `main` (ou la branche de travail) / dossier racine.
- **Vercel** / **Netlify** : importer le dépôt, aucun build requis (framework preset = *Other*).

## 📋 Conformité au cahier des charges

Le site inclut, comme demandé : nom et logo, mission et valeurs, présentation du produit,
caractéristiques principales, section contact, et une cohérence visuelle complète avec la charte graphique.
