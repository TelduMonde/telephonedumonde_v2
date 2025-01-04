import ProductCardDetail from "@/components/Boutique/DetailProduit/ProductCardDetail";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique | Téléphones du Monde | Smartphones à Prix Réduits",
  description:
    "Explorez notre boutique et découvrez une large sélection de smartphones internationaux neufs et performants à des prix imbattables. Trouvez votre prochain téléphone dès aujourd'hui !",
  keywords: [
    "boutique smartphones",
    "téléphones internationaux",
    "téléphones pas chers",
    "acheter téléphone neuf",
    "smartphone prix réduit",
    "modèles de téléphone",
    "smartphones performants",
    "téléphones débloqués",
  ],
};

export default async function page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;

  return (
    <section className="flex-center">
      <ProductCardDetail slug={slug} />
    </section>
  );
}
