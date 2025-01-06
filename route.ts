export const DEFAULT_LOGIN_REDIRECT = "/";

export const publicRoutes = [
  "/",
  "/boutique",
  "/boutique/[slug]",
  "/concept",
  "/contact",
  "/mentions-legales",
  "/politique-de-confidentialite",
  "/cgv",
  "/livraison-et-retour",
  "/checkout",
  "/erreur",
  "/mon-compte",
  "/mon-compte/commandes",
  "/mon-compte/favoris",
  "/mon-compte/infos-personnelles",
  "/panier",
  "/success",
  "/se-connecter",
  "/not-found",
];

export const authRoutes = [
  "/se-connecter",
  "/creer-mon-compte",
  "/auth/new-verification",
  "/auth/reset",
  "/auth/nouveau-mot-de-passe",
];

export const adminRoutes = [
  "/admin-tel-du-monde",
  "/admin-tel-du-monde/clients",
  "/admin-tel-du-monde/commandes",
  "/admin-tel-du-monde/produits",
];

export const adminPrefix = "/admin";

export const apiAuthPrefix = "/api/auth";

export const apiEmailPrefix = "/api/email";

export const apiUploadPrefix = "/api/uploadthing";
