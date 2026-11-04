# CapDev – site de l'institution de recherche

Site React + Vite servi par un serveur Express (`server.ts`), sur le même modèle que le site du CICEXF, avec :

- **9 onglets publics**, chacun à sa propre adresse : `/institut`, `/recherche`, `/publications`, `/chercheurs`, `/formations`, `/expertise`, `/actualites`, `/opportunites`, `/contact` ;
- **l'assistant virtuel « Docteur »** (nom modifiable dans l'administration) : IA Gemini si une clé est fournie, sinon réponses tirées des contenus du site ;
- **un onglet Administration visible uniquement par l'administrateur principal** une fois connecté (lien « Espace administrateur » en pied de page, ou `/connexion`) ;
- **4 palettes de couleurs** (clair et sombre), choisies depuis l'administration avec aperçu en direct ;
- **la traduction** : le site est rédigé en français ; l'administrateur active d'autres langues et traduit à la main ou automatiquement (Gemini). Tout texte non traduit s'affiche en français.

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000. Sans configuration, un compte de **développement** est créé : `admin@capdev.local` / `capdev-admin` (désactivé en production).

## Mise en production

1. Choisir le mot de passe de l'administrateur principal et générer son empreinte :
   ```bash
   npm run hash-password -- "un mot de passe long et unique"
   ```
2. Copier `.env.example` en `.env` et renseigner `ADMIN_EMAIL`, puis les deux lignes `ADMIN_PASSWORD_HASH` et `SESSION_SECRET` données par la commande ci-dessus, et `GEMINI_API_KEY` pour l'IA et la traduction automatique.
3. Construire puis démarrer :
   ```bash
   npm run build
   ```
   ```bash
   npm start
   ```

Les contenus, messages, conversations et images sont enregistrés dans `DATA_DIR` (par défaut `./data`). Sur l'hébergeur, ce dossier doit être un **disque persistant** et faire partie des sauvegardes.

## Administration

| Rubrique | Rôle |
| --- | --- |
| Tableau de bord | Messages non lus, conversations, état de l'IA et des traductions, ajouts rapides |
| Contenus | Actualités, agenda, publications, axes, projets, chercheurs, formations, services, opportunités, partenaires (ajout, modification, suppression, ordre, images) |
| Textes et coordonnées | Accueil, mission, mot du Directeur, gouvernance, coordonnées, chiffres clés, nom et message d'accueil de l'assistant |
| Couleurs et apparence | Choix de la palette avec aperçu sur tout l'écran avant application |
| Langues et traductions | Activer des langues (anglais, espagnol, portugais, arabe, allemand, italien, chinois) et traduire |
| Messages reçus | Formulaires de contact, inscriptions, demandes d'étude, coordonnées laissées à l'assistant |
| Conversations assistant | Ce que les visiteurs demandent à l'assistant |

## Traductions des textes d'interface

Les textes des menus et boutons sont écrits `t('…')` dans le code. `npm run dev` et `npm run build` les recensent automatiquement (`scripts/extract-ui-strings.mjs`) pour qu'ils apparaissent dans l'administration.
