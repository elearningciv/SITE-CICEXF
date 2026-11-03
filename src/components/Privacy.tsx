import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

/** Privacy policy (/confidentialite), kept short on purpose; also the URL given to Meta for lead ads */

const UPDATED = '2 novembre 2026';

const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  {
    id: 'informations',
    title: '1. Les informations que nous collectons',
    body: (
      <>
        <p>Nous recueillons uniquement les informations que vous nous transmettez :</p>
        <ul>
          <li>votre identité : nom et prénom ;</li>
          <li>vos coordonnées : téléphone, WhatsApp et adresse e-mail ;</li>
          <li>votre situation professionnelle : entreprise ou organisation, fonction ;</li>
          <li>la formation ou le service qui vous intéresse, et vos messages, y compris vos échanges avec notre assistante virtuelle ADI.</li>
        </ul>
        <p>Le site enregistre aussi quelques données techniques de visite (pages consultées, type de navigateur) pour améliorer son fonctionnement.</p>
      </>
    )
  },
  {
    id: 'utilisation',
    title: '2. Pourquoi nous les utilisons',
    body: (
      <>
        <p>
          Ces informations servent uniquement à <strong>vous identifier et traiter votre candidature ou votre demande</strong>, et à vous
          présenter nos offres de formation et d'accompagnement.
        </p>
        <p>
          Vos échanges avec ADI sont enregistrés et relus par le cabinet pour assurer le suivi de votre demande. ADI peut vous
          proposer de laisser votre numéro WhatsApp afin qu'un conseiller vous recontacte : c'est toujours facultatif.
        </p>
        <p>
          <strong>Aucune information sensible ou confidentielle n'est collectée</strong> : ni données de santé, de religion ou d'opinion, ni
          mot de passe, ni coordonnées bancaires.
        </p>
      </>
    )
  },
  {
    id: 'securite',
    title: '3. Sécurité et confidentialité',
    body: (
      <>
        <p>
          Le CICEXF applique une <strong>politique de sécurité des données</strong> : échanges chiffrés, accès réservé aux seules personnes
          habilitées du cabinet.
        </p>
        <p>
          <strong>Vos données ne sont ni diffusées, ni vendues, ni cédées à des tiers.</strong> Pour les consulter ou les faire supprimer,
          écrivez-nous à <a href="mailto:cabinetcicexf@gmail.com">cabinetcicexf@gmail.com</a>.
        </p>
      </>
    )
  }
];

export default function Privacy() {
  return (
    <div id="privacy-view" className="bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-emerald/10 text-brand-emerald dark:text-orange-300">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Politique de confidentialité</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Dernière mise à jour : {UPDATED}</p>
          <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            Le CICEXF protège les informations que vous lui confiez et les utilise uniquement pour répondre à vos demandes.
          </p>
        </header>

        <div className="privacy-content mt-6 space-y-6">
          {SECTIONS.map(s => (
            <section key={s.id} id={s.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-8">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white sm:text-xl">{s.title}</h2>
              <div className="mt-3 space-y-3 text-base leading-relaxed text-slate-700 dark:text-slate-300">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
