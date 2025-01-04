import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="text-white bg-noir-900 py-14 lg:py-20">
      <div className="px-4 lg:px-0 flex flex-col gap-6 flex-center lg:gap-8">
        <p className="font-font1 tracking-widest text-xl p-4 border rounded-md">
          Téléphone du Monde
        </p>

        <div className="flex flex-col gap-4 lg:flex-row lg:gap-8 text-center">
          <Link
            href="/mentions-legales"
            className="text-xs hover:text-white/70 transition-all ease-in-out duration-300"
          >
            Mentions Légales
          </Link>
          <Link
            href="/cgv"
            className="text-xs hover:text-white/70 transition-all ease-in-out duration-300"
          >
            CGV
          </Link>
          <Link
            href="/politique-de-confidentialite"
            className="text-xs hover:text-white/70 transition-all ease-in-out duration-300"
          >
            Politique de confidentialité
          </Link>
          <Link
            href="/livraison-et-retour"
            className="text-xs hover:text-white/70 transition-all ease-in-out duration-300"
          >
            Livaisons & retours
          </Link>
          <Link
            href="/contact"
            className="text-xs hover:text-white/70 transition-all ease-in-out duration-300"
          >
            Contact
          </Link>
        </div>
        <p className="text-[10px]">
          Website by{" "}
          <Link
            href={"https://www.inthegleam.com/"}
            target="_blank"
            className="hover:text-white/70 transition-all ease-in-out duration-300 font-font1 tracking-widest"
          >
            INTHEGLEAM
          </Link>
        </p>
      </div>
    </footer>
  );
}
