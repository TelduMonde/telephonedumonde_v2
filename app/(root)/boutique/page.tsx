import FilterBrand from "@/components/Admin/Phones/FilterBrand";
import ProductList from "@/components/Boutique/ProductList";

export default function page() {
  return (
    <section className="wrapper flex flex-col gap-10">
      <h1 className="sm:mt-2 font-font1 text-white uppercase text-base sm:text-4xl font-extrabold tracking-wide">
        Comparez nos modèles de téléphone
      </h1>
      <div className="h-[1px] w-2/3 bg-gradient-to-r from-white to-noir-900" />

      <div className="flex gap-10">
        {/* FILTRAGE PAR MARQUE, MODELE OU PRIX */}
        <FilterBrand />
        <FilterBrand />
        <FilterBrand />
      </div>

      <div className="flex justify-center items-center w-full">
        <ProductList />
      </div>
    </section>
  );
}
