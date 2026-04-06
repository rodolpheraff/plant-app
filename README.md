# 🌿 Plantes — Application de suivi partagée

Application PWA pour suivre vos plantes à deux, synchronisée via GitHub Gist.

## Fonctionnalités

- 📋 Liste de toutes vos plantes avec statut d'arrosage
- 🌿 Fiche détaillée : exposition, arrosage, terre, engrais, rempotage, notes
- 💧 Suivi des arrosages avec indicateur d'urgence
- 🔄 Synchronisation en temps réel via GitHub Gist (partagé)
- 📱 Installable sur iPhone comme une app native

---

## Déploiement en 5 minutes

### 1. Fork / clone ce repo

```bash
git clone https://github.com/rodolpheraff/plant-app.git
cd plant-app
npm install
```

### 2. Créer un repo GitHub

Crée un repo public nommé `plant-app` sur ton compte GitHub (`rodolpheraff`).

```bash
git remote add origin https://github.com/rodolpheraff/plant-app.git
git branch -M main
git push -u origin main
```

### 3. Déployer sur GitHub Pages

```bash
npm run deploy
```

➡️ L'app sera dispo sur : **https://rodolpheraff.github.io/plant-app/**

> Si c'est la première fois, va dans Settings → Pages → Source → `gh-pages` branch

### 4. Configurer l'app (à faire une fois)

1. Va sur https://github.com/settings/tokens/new
2. Note : `plant-app-token`, scope : uniquement **gist** ✅
3. Génère et copie le token (`ghp_...`)
4. Ouvre l'app → entre le token → clique **Créer un nouveau Gist**
5. Note l'ID du Gist affiché
6. **Partage le token ET l'ID du Gist avec Bérénice**

Bérénice fait pareil mais entre directement le token + l'ID existant.

---

## Mises à jour

Pour mettre à jour l'app après modifications :

```bash
npm run deploy
```

---

## Stack technique

- React 18 + Vite
- GitHub Gist API (stockage partagé)
- GitHub Pages (hébergement)
- PWA (installable iPhone)
- Zéro backend, zéro coût
