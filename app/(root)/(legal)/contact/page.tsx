import { ContactForm } from "@/components/shared/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contactez-nous | Téléphones du Monde",
  description:
    "Besoin d'aide ou d'informations ? Contactez l'équipe Téléphones du Monde pour toute question sur vos commandes ou nos smartphones internationaux. Nous sommes là pour vous aider.",
  keywords: [
    "contact téléphones",
    "support client",
    "aide téléphones",
    "questions commandes",
    "service client smartphones",
    "téléphones internationaux",
    "demande d'information",
    "assistance téléphonique",
  ],
};

export default function ContactPage() {
  return (
    <section className="wrapper flex flex-col gap-10">
      <h1 className="sm:mt-2 font-font1 text-white uppercase text-base sm:text-4xl font-extrabold tracking-wide">
        Contactez-nous
      </h1>
      <div className="h-[1px] w-2/3 bg-gradient-to-r from-white to-noir-900" />

      <div className="w-full flex flex-col gap-10 justify-center items-center">
        <p className="text-white font-font1">
          N&apos;hésitez pas à nous contacter pour plus d&apos;informations sur
          nos services ou pour toutes autres demandes.
        </p>
        <div className="w-full flex-center">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
