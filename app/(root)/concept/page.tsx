/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <section className="wrapper flex flex-col gap-10">
      <h1 className="flex items-center gap-4 sm:mt-2 font-font1 text-white text-xl sm:text-4xl font-extrabold tracking-wide">
        LE CONCEPT{" "}
        <span className="text-xl font-thin font-fontb text-center inline-block p-4 border rounded-md text-white tracking-widest">
          Téléphone du monde
        </span>
      </h1>
      <div className="h-[1px] w-2/3 bg-gradient-to-r from-white to-noir-900" />

      <div className="flex flex-col justify-center gap-4 lg:flex-row lg:gap-10">
        <div className="bg-gradient-to-t from-noir-900 via-noir-900 to-noir-800 rounded-md">
          <Image
            src="/logo/Telephone_du_monde.png"
            alt="phone"
            width={1920}
            height={1080}
            className="w-72 h-72 mx-auto lg:w-96 lg:h-96"
          />
        </div>

        <div className="lg:w-2/3 flex flex-col gap-6">
          <p className=" text-white font-font1">
            <span className="text-lg font-bold uppercase">
              Téléphones du Monde : Achetez des smartphones de qualité au
              meilleur prix, partout dans le monde !
            </span>
            <br /> <br /> Vous cherchez un smartphone performant à un prix
            imbattable ? Téléphones du Monde est la plateforme idéale pour
            acheter des smartphones neufs provenant des quatre coins du globe.
            Que vous soyez en France ou ailleurs, nous vous permettons d'accéder
            aux meilleurs modèles venant de pays comme le Japon ou l’Inde,
            souvent proposés à des prix beaucoup plus attractifs. <br /> <br />{" "}
            <span className="text-lg font-bold uppercase">
              Pourquoi choisir Téléphones du Monde ?
            </span>{" "}
          </p>
          <ul className="list-disc list-inside text-white font-font1">
            <li>
              <span className="font-bold">Des prix compétitifs</span> : Achetez
              des smartphones équivalents aux modèles disponibles en France,
              mais à un tarif bien plus abordable.
            </li>
            <li>
              <span className="font-bold">Une qualité garantie</span> : Tous nos
              téléphones sont 100% neufs et conformes aux standards
              internationaux.
            </li>
            <li>
              <span className="font-bold">Livraison rapide</span> : Une fois
              votre commande validée, recevez votre smartphone en seulement 7 à
              10 jours.
            </li>
            <li>
              <span className="font-bold">Économies garanties</span> : Réalisez
              des économies importantes tout en bénéficiant de la même
              technologie de pointe.
            </li>
          </ul>
          <p className=" text-white font-font1">
            Ne laissez pas passer cette opportunité d’acheter un smartphone de
            qualité à moindre coût. Profitez d’une expérience simple, rapide et
            économique avec Téléphones du Monde.{" "}
            <span className="font-bold">
              Commandez dès aujourd’hui et découvrez comment il est facile de
              joindre l'utile à l'économique.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
