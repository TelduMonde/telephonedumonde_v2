import ItemsOrder from "@/components/Order/PreCheckout/ItemsOrder";
import React from "react";

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
