// Must stay in sync with isAdmin() in firestore.rules
export const ALLOWED_ADMIN_EMAILS = [
  'elearningciv@gmail.com',
  'cabinetcicexf@gmail.com'
];

export const isAuthorizedAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ALLOWED_ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

export const getAuthErrorMessage = (err: any): string => {
  switch (err?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return "Identifiants incorrects. Vérifiez l'adresse et le mot de passe, ou utilisez « Mot de passe oublié ».";
    case 'auth/too-many-requests':
      return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
    case 'auth/network-request-failed':
      return "Connexion réseau indisponible. Vérifiez votre accès Internet.";
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return "Connexion Google annulée.";
    default:
      return "Connexion impossible pour le moment. Veuillez réessayer.";
  }
};
