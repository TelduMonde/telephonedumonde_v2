import Favoris from "@/components/Profils/Favoris";
import { currentUser } from "@/lib/auth";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes Favoris | Téléphone du Monde",
  description:
    "Retrouvez vos smartphones favoris sur Téléphone du Monde. Consultez votre liste de produits préférés et achetez-les facilement à des prix compétitifs.",
  keywords: [
    "mes favoris téléphones",
    "produits favoris",
    "liste de souhaits",
    "smartphones internationaux",
    "acheter téléphone pas cher",
    "téléphones préférés",
    "smartphones performants",
    "prix compétitifs",
  ],
};

export default async function Fav() {
  const user = await currentUser();
  const userId = user ? user.id : "";

  return (
    <section className="wrapper">
      <Favoris userId={userId} />
    </section>
  );
}
