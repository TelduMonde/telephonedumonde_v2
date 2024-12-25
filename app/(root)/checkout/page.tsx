import ItemsOrder from "@/components/Order/PreCheckout/ItemsOrder";
import React from "react";

export default function Checkout() {
  return (
    <section className="wrapper">
      <h1 className="text-xl uppercase text-white font-font1">
        Résumé de la commande
      </h1>
      <div>
        <h2 className="text-lg uppercase text-white font-font1">Articles</h2>
        <ItemsOrder />
      </div>
    </section>
  );
}
