import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Mentions Légales | Téléphone du monde",
  description: "Mentions légales du site Téléphone du monde",
};

export default function MentionsLegales() {
  return (
    <section className="wrapper flex flex-col gap-10">
      <h1 className="sm:mt-2 font-font1 text-white uppercase text-base sm:text-4xl font-extrabold tracking-wide">
        Mentions Légales
      </h1>
      <div className="h-[1px] w-2/3 bg-gradient-to-r from-white to-noir-900" />

      <div className="font-font1 text-white">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h2 className="font-bison text-[2rem]">Propriétaire du site</h2>
            <p className="text-sm">Nom du propriétaire du site : ...</p>
            <p className="text-sm">Adresse postale : ....</p>
            <p className="text-sm">Adresse mail: ....</p>
            <p className="text-sm">Numéro de téléphone : ....</p>

            <h3 className="font-bold">Hébergeur du site :</h3>
            <p className="text-sm">Nom de l&apos;hébergeur : Vercel</p>
            <p className="text-sm">Adresse : San Francisco</p>
            <p className="text-sm">Coordonnées : https://www.vercel.com</p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-[2rem]">Propriété intellectuelle</h2>
            <p className="text-sm">
              La structure générale ainsi que les textes, sons, son savoir-faire
              et tous les autres éléments composant le site sont la proproété
              exclusive de www.bellenippe.fr
            </p>
            <p className="text-sm">
              Les logos et marques des sociétés citées sur le site bellenippe.fr
              sont la propriété exclusive de leurs auteurs respectifs. Toutes
              représentations et/ou reproductions et/ou exploitation partielle
              ou totale de ce site, par quelques procédés que ce soit, sans
              l&apos;autorisation expresse et préalable de bellenippe.fr est
              interdite et constituerait une contrefaçon au sens des articles L
              335-2 et suivants du Code de la propriété intellectuelle.
            </p>
            <p className="text-sm">
              L&apos;élaboration de liens hypertextes profonds vers le site
              bellenippe.fr est interdite sans l&apos;accord exprès et préalable
              de bellenippe.fr. Par ailleurs, l&apos;utilisation des
              informations contenues sur le site relève de la seule
              responsabilité de l&apos;utilisateur. Nous ne pourrions en aucun
              cas, et pour quelque cause que ce soit, en être tenus pour
              responsables, et ce, quelque en soit les conséquences. Nous ne
              sommes responsables d&apos;aucune erreur ou omission sur le
              présent site.
            </p>
            <p className="text-sm">
              Les photos et les illustrations utilisées sur le site
              bellenippe.fr sont la propriété de leurs auteurs respectifs. Toute
              reproduction totale ou partielle de ces éléments sans
              l&apos;autorisation expresse de leurs auteurs est interdite.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-[2rem]">Avertissement Général</h2>
            <p className="text-sm">
              La consultation du site bellenippe.fr est proposée aux internautes
              à titre gratuit et sans aucune garantie de la part de son éditeur.
              Les informations disponibles sur ce site qui proviendrait de
              sources extérieures ne saurait garantir qu&apos;elles sont
              exemptes d&apos;erreurs, ni garantir leur complétude, leur
              actualité, leur exhaustivité ou autre.
            </p>
            <p className="text-sm">
              Les propriétaires des sites marchands, de services, sites persos,
              site informatiques (etc.) consultés à partir du site bellenippe.fr
              sont seuls responsables du respect par eux de l&apos;ensemble des
              réglementations s&apos;appliquant dans le cadre des prestations
              offertes aux clients finaux, et notamment, des lois et réglements
              relatif à : la vente à distance, la protection du consommateur, la
              publicité mensongère ou trompeuse, les prix, la conformité des
              produits.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-[2rem]">Crédit & Copyright</h2>
            <p className="text-sm">
              Les crédits et copyright des visuels et des photos présents sur le
              blog bellenippe.fr sont signalés lorsqu&apos;elles proviennent
              d&apos;un professionnel avec son accord.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
