import { useState } from 'react';
import { Building, Shield } from 'lucide-react';
import FlippingSheet, { SheetItem } from './FlippingSheet';

// Structure À propos de nous : Notre Histoire, Notre Vision, Notre Mission, Nos Valeurs (page unique)
// Rédigé en paragraphes clairs sans icônes ni cases à cocher
const ABOUT_SHEETS: SheetItem[] = [
  {
    id: 'notre-histoire',
    number: 1,
    tag: 'Origine & Fondation',
    title: 'Notre Histoire',
    subtitle: 'Genèse, Ancrage & Trajectoire d’Excellence',
    quote: '« Bâtir un pont solide entre les meilleures compétences internationales et les défis concrets des organisations. »',
    paragraphs: [
      "Le Cabinet International de Conseil, d'Expertise et de Formation (CICEXF) est né de la volonté partagée d'experts chevronnés, d'universitaires et de praticiens de haut niveau désireux d'offrir une ingénierie de conseil indépendante et résolument tournée vers les résultats.",
      "Dès sa fondation, le cabinet s'est donné pour mandat de répondre aux exigences croissantes des administrations publiques, des grands projets de développement et des entreprises privées confrontées aux impératifs de modernisation, de digitalisation et de bonne gouvernance.",
      "Au fil des interventions et des chantiers stratégiques menés avec succès, le CICEXF s'est imposé comme un partenaire institutionnel de confiance incontournable, alliant rigueur méthodologique, diagnostics sur-mesure et transfert pérenne de compétences.",
      "Aujourd'hui fort d'un écosystème pluridisciplinaire d'experts de premier rang, notre cabinet poursuit son expansion en restant fidèle à sa vocation première : transformer le potentiel humain et institutionnel en levier pérenne de croissance et de souveraineté opérationnelle."
    ],
    footerNote: 'Fondation institutionnelle et trajectoire d’impact certifiées',
    stamp: 'HISTOIRE OFFICIELLE',
    colorScheme: 'brown'
  },
  {
    id: 'notre-vision',
    number: 2,
    tag: 'Orientation Stratégique',
    title: 'Notre Vision',
    subtitle: 'Standard International & Horizon 2030',
    quote: '« Devenir une référence internationale incontournable en expertise et ingénierie de solutions innovantes. »',
    paragraphs: [
      "Notre vision est d'ériger le CICEXF en une référence internationale incontournable en matière d'ingénierie intégrée et de renforcement des capacités managériales et institutionnelles de premier plan.",
      "Nous anticipons les mutations économiques, écologiques et technologiques pour proposer des modèles d'intervention avant-gardistes, alignés sur les standards de gouvernance les plus exigeants à l'échelle panafricaine et mondiale.",
      "À travers un réseau dense de partenaires techniques et d'experts de haut niveau, nous assurons un transfert permanent de méthodologies éprouvées au profit des administrations publiques, des grands projets de développement et des entreprises privées.",
      "Cet engagement prospectif guide chacune de nos initiatives, en plaçant la modernité, l'intégrité déontologique et la création de valeur durable au cœur de notre trajectoire stratégique à l'horizon 2030."
    ],
    footerNote: 'Cap prospectif délibéré et validé par les organes de gouvernance',
    stamp: 'VISION OFFICIELLE',
    colorScheme: 'blue'
  },
  {
    id: 'notre-mission',
    number: 3,
    tag: 'Impact Opérationnel',
    title: 'Notre Mission',
    subtitle: 'Rigueur Technique & Succès Mesurable',
    quote: '« Accompagner les organisations et les professionnels dans l’optimisation durable de leurs performances. »',
    paragraphs: [
      "Notre mission fondamentale consiste à accompagner les organisations, les décideurs et les équipes opérationnelles dans l'optimisation durable de leurs performances et la sécurisation de leurs investissements stratégiques.",
      "Nous combinons diagnostics méthodologiques de haute précision, élaboration de feuilles de route stratégiques sur-mesure et déploiement d'outils de pilotage décisionnel immédiatement exploitables sur le terrain.",
      "Chaque intervention est articulée autour d'un impératif de rigueur technique et de création de valeur tangible, garantissant un retour sur investissement mesurable pour l'ensemble des parties prenantes.",
      "Nous assurons un devoir d'accompagnement continu, en veillant à l'appropriation des meilleures pratiques par les équipes locales pour pérenniser les résultats obtenus bien au-delà de la mission."
    ],
    footerNote: 'Engagement contractuel d’accompagnement et de création de valeur',
    stamp: 'MISSION ENGAGÉE',
    colorScheme: 'emerald'
  },
  {
    id: 'nos-valeurs',
    number: 4,
    tag: 'Éthique & Déontologie',
    title: 'Nos Valeurs',
    subtitle: 'Les 5 Valeurs Cardinales du Cabinet',
    quote: '« L’éthique, la rigueur et l’excellence au cœur de chaque action et de chaque décision. »',
    valuesList: [
      {
        name: 'Excellence',
        description: 'Le refus systématique de l’approximation et l’exigence d’une qualité technique supérieure. Chaque livrable, audit et formation fait l’objet d’une double revue par des pairs experts afin de dépasser constamment les attentes de nos mandants.'
      },
      {
        name: 'Rigueur',
        description: 'Une armature méthodologique et scientifique stricte, fondée exclusivement sur des données factuelles vérifiées et des standards internationaux, garantissant une impartialité totale et le respect scrupuleux des délais.'
      },
      {
        name: 'Transparence',
        description: 'Une clarté contractuelle totale et une communication honnête sur les enjeux réels. Nos honoraires et nos méthodes sont limpides, sans coûts dissimulés, bâtissant une relation de confiance mutuelle durable.'
      },
      {
        name: 'Redevabilité',
        description: 'La responsabilité morale et opérationnelle de nos préconisations. Le cabinet s’engage activement sur la mesure de l’impact concret et la pérennité des résultats sur le terrain après la clôture de la mission.'
      },
      {
        name: 'Innovation',
        description: 'L’adoption continue des technologies de pointe, des outils d’analyse prédictive et des solutions novatrices adaptées aux réalités économiques et régionales pour anticiper et relever les défis de demain.'
      }
    ],
    footerNote: 'Charte éthique et déontologique signée par l’ensemble des consultants du cabinet',
    stamp: 'VALEURS OFFICIELLES',
    colorScheme: 'emerald'
  }
];

export default function About() {
  const [selectedNode, setSelectedNode] = useState<string>('DG');
  const [activeTab, setActiveTab] = useState<'map' | 'satellite'>('map');

  const organigrammeData: Record<string, { title: string; desc: string; role: string }> = {
    AG: {
      title: "Assemblée Générale",
      role: "Actionnaires & Fondateurs",
      desc: "Organe souverain définissant la politique générale du cabinet, validant les comptes annuels et élisant les membres du Conseil d'Administration."
    },
    CA: {
      title: "Conseil d'Administration",
      role: "Gouvernance Stratégique",
      desc: "Supervise la gestion opérationnelle de la Direction Générale, valide les investissements majeurs et garantit le respect de la charte éthique et des valeurs."
    },
    DG: {
      title: "Direction Générale",
      role: "Direction Générale & Stratégie",
      desc: "Pilote le développement commercial à l'international, définit les priorités opérationnelles et dirige la mise en œuvre des plans stratégiques pluriannuels."
    },
    DGA: {
      title: "Direction Générale Adjointe",
      role: "Coordination Opérationnelle & Qualité",
      desc: "Coordonne l'exécution technique des chantiers d'ingénierie, supervise le contrôle de qualité interne et assure la transition numérique des offres."
    },
    Consultance: {
      title: "Pôle Consultance & Expertise",
      role: "Ingénierie de solutions",
      desc: "Regroupe les experts thématiques par domaine (Finance, Informatique, QHSE, Aménagement du territoire) pour mener les missions d'audit et de stratégie."
    },
    Formation: {
      title: "Pôle Académie & Formation",
      role: "Renforcement des capacités",
      desc: "Gère l'ingénierie pédagogique, l'accréditation des programmes d'excellence, le recrutement de formateurs agréés et le suivi-évaluation post-formation."
    }
  };

  return (
    <div id="about-view" className="py-4 bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title on a single elegant line */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-x-2 text-sm">
            <span className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl">
              À Propos de Nous :
            </span>
            <span className="text-slate-700 dark:text-slate-200 font-medium text-sm sm:text-base">
              Notre Histoire • Notre Vision • Notre Mission • Nos Valeurs
            </span>
          </div>
          <nav className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            <span>CICEXF</span>
            <span className="mx-1.5">/</span>
            <span>Qui sommes-nous</span>
            <span className="mx-1.5">/</span>
            <span className="text-brand-emerald">À propos de nous</span>
          </nav>
        </div>

        {/* FEUILLETOIR : À PROPOS DE NOUS */}
        <section id="about-sheets-section" className="py-1 mb-5">
          <FlippingSheet
            items={ABOUT_SHEETS}
            bookTitle="CICEXF"
            bookSubtitle="À Propos de Nous"
            documentRef="CICEXF/A-PROPOS"
          />
        </section>

        {/* Interactive Organigramme flow */}
        <section id="interactive-flowchart" className="py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800 p-5 sm:p-6 shadow-sm mb-5">
          <div className="max-w-3xl mx-auto text-center mb-4">
            <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
              Gouvernance &amp; Organigramme Interactif
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-sans">
              Le CICEXF est structuré selon les standards d'indépendance de gouvernance des grands cabinets internationaux. Cliquez sur les structures pour explorer leurs prérogatives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* flowchart map visualization */}
            <div className="lg:col-span-7 flex flex-col items-center space-y-3">
              
              {/* Assembly General */}
              <button
                id="node-ag"
                onClick={() => setSelectedNode('AG')}
                className={`w-full max-w-[260px] py-2 rounded-xl border font-bold text-[11px] tracking-wider uppercase text-center transition-all ${selectedNode === 'AG' ? 'bg-brand-blue-dark text-white ring-4 ring-brand-emerald/30 border-transparent shadow-md' : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}`}
              >
                Assemblée Générale (AG)
              </button>

              <div className="w-0.5 h-3.5 bg-slate-300 dark:bg-slate-800"></div>

              {/* Board */}
              <button
                id="node-ca"
                onClick={() => setSelectedNode('CA')}
                className={`w-full max-w-[260px] py-2 rounded-xl border font-bold text-[11px] tracking-wider uppercase text-center transition-all ${selectedNode === 'CA' ? 'bg-brand-blue-dark text-white ring-4 ring-brand-emerald/30 border-transparent shadow-md' : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}`}
              >
                Conseil d'Administration (CA)
              </button>

              <div className="w-0.5 h-3.5 bg-slate-300 dark:bg-slate-800"></div>

              {/* Direction Generale */}
              <button
                id="node-dg"
                onClick={() => setSelectedNode('DG')}
                className={`w-full max-w-[280px] py-3 rounded-xl border font-black text-xs tracking-wider uppercase text-center transition-all ${selectedNode === 'DG' ? 'bg-brand-emerald text-white ring-4 ring-brand-emerald/30 border-transparent shadow-lg scale-105' : 'bg-brand-emerald/10 border-brand-emerald/40 text-brand-emerald hover:bg-brand-emerald/20'}`}
              >
                Direction Générale (DG)
              </button>

              <div className="w-0.5 h-3.5 bg-slate-300 dark:bg-slate-800"></div>

              {/* Deputy General */}
              <button
                id="node-dga"
                onClick={() => setSelectedNode('DGA')}
                className={`w-full max-w-[260px] py-2 rounded-xl border font-bold text-[11px] tracking-wider uppercase text-center transition-all ${selectedNode === 'DGA' ? 'bg-brand-blue-dark text-white ring-4 ring-brand-emerald/30 border-transparent shadow-md' : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}`}
              >
                Direction Générale Adjointe (DGA)
              </button>

              <div className="w-0.5 h-3.5 bg-slate-300 dark:bg-slate-800"></div>

              {/* Operational Wings */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                <button
                  id="node-consultance"
                  onClick={() => setSelectedNode('Consultance')}
                  className={`py-2 rounded-xl border font-bold text-xs tracking-wider uppercase text-center transition-all ${selectedNode === 'Consultance' ? 'bg-brand-blue text-white ring-4 ring-brand-emerald/30 border-transparent shadow-md' : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}`}
                >
                  Pôle Consultance
                </button>
                <button
                  id="node-formation"
                  onClick={() => setSelectedNode('Formation')}
                  className={`py-2 rounded-xl border font-bold text-xs tracking-wider uppercase text-center transition-all ${selectedNode === 'Formation' ? 'bg-brand-blue text-white ring-4 ring-brand-emerald/30 border-transparent shadow-md' : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'}`}
                >
                  Pôle Formation
                </button>
              </div>

            </div>

            {/* interactive node detail panel */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs uppercase font-bold text-brand-emerald tracking-widest">
                Fiche de Gouvernance
              </span>
              <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-1">
                {organigrammeData[selectedNode]?.title}
              </h4>
              <p className="text-xs font-semibold text-brand-blue dark:text-sky-400 mt-0.5">
                {organigrammeData[selectedNode]?.role}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed font-sans">
                {organigrammeData[selectedNode]?.desc}
              </p>
              
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Réglement intérieur validé</span>
                <span className="text-brand-emerald font-bold">✓ Actif</span>
              </div>
            </div>

          </div>
        </section>

        {/* Implantation Géographique & Siège */}
        <section id="geo-location" className="py-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div>
                <span className="text-xs uppercase font-bold text-brand-emerald tracking-widest">
                  IMPLANTATION GÉOGRAPHIQUE
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Siège Social &amp; Antenne Régionale
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-sans">
                  Une présence stratégique au carrefour de l'Afrique de l'Ouest pour rayonner sur l'ensemble de l'espace francophone et anglophone.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start space-x-3 text-slate-600 dark:text-slate-300">
                  <Building className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white font-semibold">Siège CICEXF Abidjan :</strong> Cocody Angré 8ème Tranche, Carrefour Duncan, Abidjan - Côte d'Ivoire.
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-slate-600 dark:text-slate-300">
                  <Shield className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white font-semibold">Représentations :</strong> Antennes opérationnelles au Bénin, Togo, Mali et Burkina Faso.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-850 text-xs">
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${activeTab === 'map' ? 'bg-white dark:bg-slate-700 text-brand-emerald shadow-xs' : 'text-slate-500'}`}
                  >
                    Plan interactif
                  </button>
                  <button
                    onClick={() => setActiveTab('satellite')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${activeTab === 'satellite' ? 'bg-white dark:bg-slate-700 text-brand-emerald shadow-xs' : 'text-slate-500'}`}
                  >
                    Vue Satellite
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 h-72 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-inner relative group">
              <iframe
                title="Localisation CICEXF"
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15887.892305541607!2d-3.993437190013778!3d5.385317770857317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1935619184511%3A0x64cf45e15bf9462b!2sAngr%C3%A9%208e%20Tranche%2C%20Abidjan!5e${activeTab === 'satellite' ? '1' : '0'}!3m2!1sfr!2sci!4v1700000000000!5m2!1sfr!2sci`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[25%] contrast-110 group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
