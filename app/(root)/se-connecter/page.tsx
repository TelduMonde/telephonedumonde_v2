import { LoginForm } from "@/components/Auth/Form/LoginForm";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | Téléphone du Monde",
  description:
    "Connectez-vous à votre compte Téléphone du Monde pour gérer vos commandes, consulter vos informations personnelles et accéder à vos offres exclusives. Une expérience simple et rapide.",
  keywords: [
    "connexion téléphones",
    "se connecter",
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
    <section className="p-4 w-full mt-10 md:w-1/3 mx-auto">
      <Suspense>
        <LoginForm />
      </Suspense>
    </section>
  );
}
