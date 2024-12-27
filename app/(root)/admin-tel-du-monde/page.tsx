import AddPromoCodeBtn from "@/components/Admin/PromoCode/AddPromoCode";
import ShowActifPromo from "@/components/Admin/PromoCode/ShowActifPromo";
import ShowAllPromo from "@/components/Admin/PromoCode/ShowAllPromo";
import React from "react";

export default function AdminPage() {
  return (
    <>
      <section className="wrapper">
        <div className="flex gap-8">
          <div className="bg-noir-800 w-full p-2 rounded-md">
            <h2 className="text-white font-font1">Revenu total</h2>
          </div>
          <div className="bg-noir-800 w-full p-2 rounded-md">
            <h2 className="text-white font-font1">Total Commandes</h2>
          </div>
          <div className="bg-noir-800 w-full p-2 rounded-md">
            <h2 className="text-white font-font1">Total Clients</h2>
          </div>
        </div>
      </section>

      <section className="wrapper flex flex-col gap-4">
        <h2 className="text-white font-font1">
          Les dernières commandes passées (semaine)
        </h2>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-5 items-center bg-noir-800 w-full p-2 rounded-md text-white font-font1 text-sm tracking-wide">
            <p>C. 9087868</p>
            <p>Date</p>
            <p>1299,99 €</p>
            <p>Statut : EN COURS</p>
            <button className="bg-primary-900 rounded-md p-1 hover:bg-primary-700">
              Voir la commande
            </button>
          </div>
          <div className="grid grid-cols-5 items-center bg-noir-800 w-full p-2 rounded-md text-white font-font1 text-sm tracking-wide">
            <p>C. 9087868</p>
            <p>Date</p>
            <p>1299,99 €</p>
            <p>Statut : EN COURS</p>
            <button className="bg-primary-900 rounded-md p-1 hover:bg-primary-700">
              Voir la commande
            </button>
          </div>
        </div>
      </section>

      <section className="wrapper">
        <div className="bg-noir-800 w-full p-2 rounded-md h-[200px]">
          <h2 className="text-white font-font1">Ventes</h2>
        </div>
      </section>

      <section className="wrapper flex flex-col gap-4">
        <div className="flex justify-between">
          <h2 className="text-white font-font1">Code promo</h2>
          <AddPromoCodeBtn />
        </div>
        {/* AFFICHER LES CODES PROMOS ACTIFS (NON EXPIREES) */}
        <ShowActifPromo />
        {/* BOUTON POUR AFFICHER LES CODE PROMO : liste de tous les codes promos créés + bouton modifier/supprimer */}
        <ShowAllPromo />
      </section>
    </>
  );
}
