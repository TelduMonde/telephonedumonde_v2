import { RegisterForm } from "@/components/Auth/Form/RegisterForm";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription | Téléphones du Monde | Rejoignez-nous",
  description:
    "Rejoignez Téléphones du Monde pour accéder à une large sélection de smartphones internationaux de qualité à prix compétitifs. Inscrivez-vous dès maintenant pour ne pas manquer nos offres exclusives.",
  keywords: [
    "inscription téléphones",
    "créer un compte",
    "rejoindre téléphones du monde",
    "smartphones internationaux",
    "téléphones pas chers",
    "acheter téléphone neuf",
    "smartphone prix réduit",
  ],
};

export default function page() {
  return (
    <section className="p-4 mt-10 md:w-1/3 flex justify-center items-center mx-auto">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </section>
  );
}
