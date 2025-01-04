import PanierMobile from "@/components/Panier/PanierMobile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Votre Panier | Téléphones du Monde",
  description:
    "Consultez votre panier sur Téléphones du Monde pour finaliser votre commande. Découvrez des smartphones internationaux de qualité à des prix compétitifs. Livraison rapide et sécurité garantie.",
  keywords: [
    "panier téléphones",
    "acheter smartphone",
    "commande téléphone",
    "smartphones internationaux",
    "téléphones pas chers",
    "finaliser commande",
    "prix compétitifs",
    "livraison rapide",
  ],
};

export default function Panier() {
  return (
    <div>
      <PanierMobile />
    </div>
  );
}
