import { SoftwareTool } from '../types';

export interface SoftwarePreset {
  name: string;
  iconUrl: string;
  category: string;
}

export const PRESET_SOFTWARE_TOOLS: SoftwarePreset[] = [
  {
    name: 'Power BI',
    iconUrl: 'https://raw.githubusercontent.com/microsoft/PowerBI-Icons/main/PNG/Power-BI.png',
    category: 'Business Intelligence & Data'
  },
  {
    name: 'Python',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    category: 'Data Science & Automatisation'
  },
  {
    name: 'Microsoft Excel',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg',
    category: 'Modélisation & Analyse'
  },
  {
    name: 'QGIS',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/QGIS_logo_new.svg',
    category: 'SIG & Télédétection'
  },
  {
    name: 'ArcGIS',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/ArcGIS_logo.png',
    category: 'SIG & Géomatique'
  },
  {
    name: 'KoboToolbox / KoboCollect',
    iconUrl: 'https://www.kobotoolbox.org/assets/images/kobo-logo.svg',
    category: 'Collecte Mobile de Données'
  },
  {
    name: 'SPSS Statistics',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/IBM_SPSS_Statistics_logo.svg/120px-IBM_SPSS_Statistics_logo.svg.png',
    category: 'Statistiques & Enquêtes'
  },
  {
    name: 'Stata',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Stata_logo.svg/320px-Stata_logo.svg.png',
    category: 'Économétrie & Biostatistiques'
  },
  {
    name: 'SAP ERP',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg',
    category: 'Gestion d\'Entreprise & Finance'
  },
  {
    name: 'Sage 100 / Sage Saari',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Sage_logo.svg',
    category: 'Comptabilité & Paie'
  },
  {
    name: 'AutoCAD',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/AutoCAD_Logo.svg',
    category: 'CAO / DAO & Génie Civil'
  },
  {
    name: 'MS Project',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Microsoft_Office_Project_%282019%E2%80%932025%29.svg',
    category: 'Gestion de Projets & Planification'
  },
  {
    name: 'Tableau Software',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tableau/tableau-original.svg',
    category: 'Dataviz & Tableaux de bord'
  },
  {
    name: 'PostgreSQL / PostGIS',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    category: 'Bases de Données Spatiales'
  },
  {
    name: 'Jira / Atlassian',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg',
    category: 'Management Agile & Suivi'
  },
  {
    name: 'R / RStudio',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg',
    category: 'Bio-statistiques & Modélisation'
  }
];
