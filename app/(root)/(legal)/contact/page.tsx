import { ContactForm } from "@/components/shared/ContactForm";

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
