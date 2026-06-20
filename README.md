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

## 📂 Structure

```
.
├── index.html          # Page unique (Hero, Mission, Produit, Caractéristiques, Contact)
├── css/style.css       # Styles + charte graphique + responsive
├── js/main.js          # Menu mobile, année dynamique, validation du formulaire
└── assets/
    └── logo-ecodrive.svg
```

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
