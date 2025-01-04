import ItemsOrder from "@/components/Order/PreCheckout/ItemsOrder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement | Téléphones du Monde",
  description:
    "Finalisez votre achat en toute sécurité sur Téléphones du Monde. Vérifiez vos articles, choisissez votre mode de livraison et effectuez un paiement sécurisé pour recevoir vos smartphones internationaux rapidement.",
  keywords: [
    "paiement téléphones",
    "checkout téléphones",
    "finaliser commande",
    "smartphones internationaux",
    "téléphones pas chers",
    "paiement sécurisé",
    "livraison rapide",
    "acheter smartphone",
  ],
};

export default function Checkout() {
  return (
    <section className="wrapper flex flex-col gap-10">
      <h1 className="sm:mt-2 font-font1 text-white uppercase text-base sm:text-4xl font-extrabold tracking-wide">
        Résumé de la commande
      </h1>
      <div className="h-[1px] w-2/3 bg-gradient-to-r from-white to-noir-900" />

      <div>
        <ItemsOrder />
      </div>
    </section>
  );
}
