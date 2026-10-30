# CICEXF – Cabinet International de Consultance, d'Expertise et de Formation

Site institutionnel (React + Vite + Firebase), servi par `server.ts` (Express) qui héberge aussi l'assistante ADILINE (Gemini, clé côté serveur).

## Lancer en local

1. `npm install`
2. Copier `.env.example` en `.env.local` et renseigner `GEMINI_API_KEY`
3. `npm run dev` puis ouvrir http://localhost:3000

Build de production : `npm run build` puis `NODE_ENV=production npm start`.

## Pages

Chaque rubrique a sa propre adresse : `/`, `/qui-sommes-nous`, `/accompagnement`, `/formations`, `/realisations`, `/actualites`, `/partenaires`, `/contact`, `/admin`.

## Administration

L'accès admin repose uniquement sur **Firebase Authentication**. Seules les adresses listées dans `src/lib/adminAuth.ts` **et** dans `firestore.rules` (fonction `isAdmin()`) sont autorisées — garder les deux listes identiques.

Mise en place (une seule fois, dans la console Firebase) :

1. *Authentication → Sign-in method* : activer **Google** (recommandé, adresses Gmail déjà vérifiées).
2. Se connecter via « Connexion rapide avec Google » avec l'une des adresses autorisées.
3. Désactiver l'inscription publique par e-mail/mot de passe si elle n'est pas utilisée.

## Règles Firestore

`firestore.rules` : contenus lisibles par tous, modifiables uniquement par un admin ; prospects, abonnés et visites peuvent être soumis par les visiteurs mais ne sont lisibles que par un admin.

Déployer après chaque modification :

```
firebase deploy --only firestore:rules
```
