import FilterBrand from "@/components/Admin/Phones/FilterBrand";
import ProductList from "@/components/Boutique/ProductList";
import { Search } from "@/components/shared/Search";
import { Transition } from "@/components/shared/Transition";

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

export default function page() {
  return (
    <section className="wrapper flex flex-col gap-10">
      <h1 className="sm:mt-2 font-font1 text-white uppercase text-xl sm:text-4xl font-extrabold tracking-wide">
        Comparez nos modèles de smartphones
      </h1>
      <div className="h-[1px] w-2/3 bg-gradient-to-r from-white to-noir-900" />

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-10">
        {/* FILTRAGE PAR MARQUE, MODELE OU PRIX */}
        <Search />
        <FilterBrand />
      </div>
      <Transition>
        <div className="flex justify-center items-center w-full">
          <ProductList />
        </div>
      </Transition>
    </section>
  );
}
