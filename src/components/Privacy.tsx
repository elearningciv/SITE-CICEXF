import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * Privacy policy (also the URL Meta asks for in Facebook/Instagram lead ads).
 * Keep it in line with what the site really collects: forms -> `prospects`, newsletter -> `subscribers`,
 * visit statistics -> `visits`, ADILINE (Google Gemini), Facebook/Instagram messages -> `social_conversations`.
 */

const UPDATED = '31 octobre 2026';

const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  {
    id: 'responsable',
    title: '1. Qui est responsable de vos données ?',
    body: (
      <>
        <p>
          Le responsable du traitement est le <strong>Cabinet International de Consultance, d'Expertise et de Formation (CICEXF)</strong>,
          Cocody Palmeraie, Rue de la Clinique, Immeuble Prestige, 3e étage, Abidjan, Côte d'Ivoire.
        </p>
        <p>
          Contact pour toute question sur vos données : <a href="mailto:cabinetcicexf@gmail.com">cabinetcicexf@gmail.com</a> ·
          téléphone et WhatsApp : +225 07 01 97 00 65 · +225 05 74 22 22 46.
        </p>
      </>
    )
  },
  {
    id: 'donnees',
    title: '2. Quelles données collectons-nous ?',
    body: (
      <>
        <p>Uniquement les informations que vous nous transmettez vous-même, et quelques données techniques de visite :</p>
        <table>
          <thead>
            <tr><th>Situation</th><th>Données</th></tr>
          </thead>
          <tbody>
            <tr><td>Inscription à une formation, demande de devis ou d'accompagnement, formulaire de contact</td><td>Nom, e-mail, téléphone (WhatsApp), pays, entreprise et fonction, formation ou service souhaité, session et modalité, message</td></tr>
            <tr><td>Lettre d'information et demandes de documents</td><td>Nom et adresse e-mail</td></tr>
            <tr><td>Conversation avec ADILINE, notre assistante virtuelle</td><td>Les messages, documents et notes vocales que vous lui envoyez ; vos coordonnées si vous demandez un devis ou un rappel</td></tr>
            <tr><td>Formulaires de nos publicités Facebook et Instagram</td><td>Les champs que vous remplissez dans le formulaire (nom, e-mail, téléphone, entreprise, fonction, formation souhaitée)</td></tr>
            <tr><td>Messages envoyés à notre page Facebook ou à notre compte Instagram</td><td>Le contenu de vos messages et l'identifiant technique de la conversation</td></tr>
            <tr><td>Navigation sur le site</td><td>Pages consultées, date et heure, type de navigateur, identifiant de visite aléatoire, et la provenance de la visite (par exemple un lien publié sur LinkedIn)</td></tr>
          </tbody>
        </table>
        <p>Nous ne collectons pas de données sensibles (santé, religion, opinions…) et ne vous demandons jamais de mot de passe ni de coordonnées bancaires sur le site.</p>
      </>
    )
  },
  {
    id: 'finalites',
    title: '3. Pourquoi utilisons-nous ces données ?',
    body: (
      <ul>
        <li><strong>Traiter votre demande</strong> : inscription, devis, proposition d'accompagnement, réponse à vos questions (mesures précontractuelles et exécution du contrat).</li>
        <li><strong>Vous informer</strong> de nos sessions et formations, si vous vous êtes inscrit à la lettre d'information ou avez rempli un formulaire de publicité (votre consentement).</li>
        <li><strong>Vous répondre automatiquement</strong> par ADILINE, sur le site et sur nos messageries Facebook et Instagram (votre demande).</li>
        <li><strong>Améliorer le site</strong> et mesurer l'efficacité de nos publications grâce aux statistiques de visite (notre intérêt légitime).</li>
      </ul>
    )
  },
  {
    id: 'conservation',
    title: '4. Combien de temps les conservons-nous ?',
    body: (
      <ul>
        <li>Demandes, inscriptions et échanges commerciaux : <strong>3 ans</strong> après notre dernier contact, puis suppression.</li>
        <li>Lettre d'information : jusqu'à votre désabonnement.</li>
        <li>Statistiques de visite : <strong>13 mois</strong> au plus.</li>
        <li>Conversations Facebook et Instagram : <strong>12 mois</strong> au plus après le dernier message.</li>
        <li>Dossiers des participants inscrits (attestations, factures) : pendant la durée exigée par les obligations légales et comptables.</li>
      </ul>
    )
  },
  {
    id: 'droits',
    title: '5. Quels sont vos droits ?',
    body: (
      <>
        <p>
          Conformément à la loi ivoirienne n°2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel,
          vous pouvez à tout moment :
        </p>
        <ul>
          <li>accéder à vos données et en obtenir une copie ;</li>
          <li>les faire corriger ou compléter ;</li>
          <li>demander leur suppression ;</li>
          <li>vous opposer à leur utilisation, notamment pour recevoir nos informations, et retirer votre consentement.</li>
        </ul>
        <p>
          Écrivez-nous à <a href="mailto:cabinetcicexf@gmail.com">cabinetcicexf@gmail.com</a> en précisant votre demande ; nous répondons
          dans un délai d'un mois au plus.
        </p>
      </>
    )
  },
  {
    id: 'stockage',
    title: '6. Cookies et stockage dans votre navigateur',
    body: (
      <>
        <p>
          Le site n'utilise <strong>ni cookie publicitaire ni outil de suivi tiers</strong>. Il enregistre seulement dans votre navigateur
          (stockage local) : un identifiant de visite aléatoire, votre adresse e-mail si vous l'avez donnée dans un formulaire (pour ne pas
          vous la redemander) et quelques préférences d'affichage.
        </p>
        <p>Vous pouvez les effacer à tout moment depuis les réglages de votre navigateur (« Effacer les données de navigation »).</p>
      </>
    )
  },
  {
    id: 'securite',
    title: '7. Sécurité',
    body: (
      <p>
        Les échanges avec le site sont chiffrés (HTTPS) et les données sont chiffrées sur les serveurs. L'accès à
        l'administration du site est réservé aux comptes autorisés du cabinet.
      </p>
    )
  },
  {
    id: 'modifications',
    title: '8. Modifications de cette politique',
    body: (
      <p>
        Nous pouvons mettre à jour cette politique pour tenir compte de l'évolution de nos services ou de la loi. La date de dernière mise
        à jour figure en haut de cette page.
      </p>
    )
  }
];

export default function Privacy() {
  return (
    <div id="privacy-view" className="bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <header className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-emerald/10 text-brand-emerald dark:text-orange-300">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Politique de confidentialité</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Dernière mise à jour : {UPDATED}</p>
          <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            Le CICEXF utilise vos données personnelles uniquement pour répondre à vos demandes et vous informer de ses formations.
            Cette page explique lesquelles, pourquoi, combien de temps et comment exercer vos droits.
          </p>
          <nav aria-label="Sommaire" className="mt-6 grid grid-cols-1 gap-1 border-t border-slate-100 pt-5 text-sm dark:border-slate-800 sm:grid-cols-2">
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} className="font-semibold text-brand-blue hover:underline dark:text-sky-300">{s.title}</a>
            ))}
          </nav>
        </header>

        <div className="privacy-content mt-6 space-y-6">
          {SECTIONS.map(s => (
            <section key={s.id} id={s.id} className="scroll-mt-28 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-8">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white sm:text-xl">{s.title}</h2>
              <div className="mt-3 space-y-3 text-base leading-relaxed text-slate-700 dark:text-slate-300">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
