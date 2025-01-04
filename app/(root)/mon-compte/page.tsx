import OrderCard from "@/components/Profils/OrderCard";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon Compte | Téléphones du Monde",
  description:
    "Gérez votre compte Téléphones du Monde : consultez vos commandes, mettez à jour vos informations personnelles et accédez à vos offres exclusives. Simplifiez vos achats de smartphones internationaux.",
  keywords: [
    "mon compte téléphones",
    "compte utilisateur",
    "gestion de compte",
    "historique des commandes",
    "smartphones internationaux",
    "téléphones pas chers",
    "offres exclusives",
  ],
};

export default function page() {
  return (
    <section className="wrapper">
      <OrderCard />
    </section>
  );
}
