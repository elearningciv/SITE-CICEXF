import type { ReactNode } from 'react';
import { Scale } from 'lucide-react';

/** "Mentions légales" page (/mentions-legales), linked from the footer */

const UPDATED = '31 octobre 2026';

const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  {
    id: 'editeur',
    title: '1. Éditeur du site',
    body: (
      <>
        <p>
          Le site <strong>cicexf.gestionsaas.org</strong> est édité par le <strong>Cabinet International de Consultance, d'Expertise et de
          Formation (CICEXF)</strong>, société de consultance et de formation établie en Côte d'Ivoire.
        </p>
        <ul>
          <li>Siège : Cocody Palmeraie, Rue de la Clinique, Immeuble Prestige, 3e étage, Abidjan, Côte d'Ivoire</li>
          <li>Téléphone et WhatsApp : +225 07 01 97 00 65 · +225 05 74 22 22 46</li>
          <li>E-mail : <a href="mailto:cabinetcicexf@gmail.com">cabinetcicexf@gmail.com</a></li>
        </ul>
      </>
    )
  },
  {
    id: 'publication',
    title: '2. Directeur de la publication',
    body: <p>Le Directeur Général du CICEXF, joignable à l'adresse <a href="mailto:cabinetcicexf@gmail.com">cabinetcicexf@gmail.com</a>.</p>
  },
  {
    id: 'hebergement',
    title: '3. Hébergement',
    body: (
      <p>
        Le site est hébergé par <strong>Hostinger International Ltd</strong> (<a href="https://www.hostinger.com" target="_blank" rel="noreferrer">www.hostinger.com</a>).
      </p>
    )
  },
  {
    id: 'propriete',
    title: '4. Propriété intellectuelle',
    body: (
      <>
        <p>
          L'ensemble des contenus du site (textes, programmes de formation, catalogue, logo, mise en page) est la propriété du CICEXF,
          sauf mention contraire. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite du
          CICEXF est interdite.
        </p>
        <p>
          Certaines photographies proviennent de la banque d'images <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a>,
          utilisées selon sa licence.
        </p>
      </>
    )
  },
  {
    id: 'responsabilite',
    title: '5. Responsabilité',
    body: (
      <>
        <p>
          Le CICEXF s'efforce de fournir des informations exactes et à jour (programmes, dates de session, tarifs). Elles sont toutefois
          données à titre indicatif et peuvent évoluer : seuls la proposition écrite, la facture proforma ou la convention de formation
          remises au participant font foi.
        </p>
        <p>
          Les réponses de l'assistante virtuelle ADILINE sont générées automatiquement à partir des informations du site ; en cas de doute,
          contactez directement le cabinet.
        </p>
      </>
    )
  },
  {
    id: 'liens',
    title: '6. Liens vers d\'autres sites',
    body: (
      <p>
        Le site peut contenir des liens vers d'autres sites (réseaux sociaux, partenaires). Le CICEXF n'est pas responsable de leur contenu
        ni de leurs pratiques en matière de données personnelles.
      </p>
    )
  },
  {
    id: 'donnees',
    title: '7. Données personnelles',
    body: (
      <p>
        Le traitement des informations que vous nous transmettez est décrit dans notre{' '}
        <a href="/confidentialite">politique de confidentialité</a>, qui précise aussi comment exercer vos droits.
      </p>
    )
  },
  {
    id: 'droit',
    title: '8. Droit applicable',
    body: (
      <p>
        Les présentes mentions légales sont régies par le droit ivoirien. En cas de litige, et à défaut de solution amiable, les
        juridictions d'Abidjan sont seules compétentes.
      </p>
    )
  }
];

export default function LegalNotice() {
  return (
    <div id="legal-view" className="bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <header className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-emerald/10 text-brand-emerald dark:text-orange-300">
            <Scale className="w-6 h-6" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Mentions légales</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Dernière mise à jour : {UPDATED}</p>
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
