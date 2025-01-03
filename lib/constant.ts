import {
  MdOutlineLocalShipping,
  MdOutlineAccountCircle,
  MdFavorite,
} from "react-icons/md";

export const headerLinkMain = [
  {
    label: "Accueil",
    href: "/",
  },
  {
    label: "Boutique",
    href: "/boutique",
  },
  {
    label: "Concept",
    href: "/concept",
  },
];

export const headerLinkAdmin = [
  {
    label: "Accueil",
    href: "/",
  },
  {
    label: "Boutique",
    href: "/boutique",
  },
  {
    label: "Concept",
    href: "/concept",
  },
  {
    label: "Admin",
    href: "/admin-tel-du-monde",
  },
];

export const headerProfilLink = [
  {
    label: "Mes commandes",
    href: "/mon-compte",
    icon: MdOutlineLocalShipping,
  },
  {
    label: "Mes Favoris",
    href: "/mon-compte/favoris",
    icon: MdFavorite,
  },
  {
    label: "Paramètres",
    href: "/mon-compte/infos-personnelles",
    icon: MdOutlineAccountCircle,
  },
];
