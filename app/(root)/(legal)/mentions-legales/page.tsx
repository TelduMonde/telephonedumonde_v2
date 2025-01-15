/* eslint-disable react/no-unescaped-entities */
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
            <h2 className="font-font1 text-[2rem] font-bold">
              Identification de l'éditeur
            </h2>
            <p className="text-sm">
              Le site internet Téléphone du Monde est édité par la société KB WB
              Concept - FZCO, enregistrée aux Emirats Arabes Unis.
            </p>
            <p className="text-sm">
              <span className="font-bold">Raison sociale :</span> KB WB Concept
              - FZCO
            </p>
            <p className="text-sm">
              {" "}
              <span className="font-bold">Statut légal :</span> Freezone Company
            </p>
            <p className="text-sm">
              <span className="font-bold">Siège social :</span> IFZA Properties,
              Dubai Silicon Oasis, Emirats Arabes Unis
            </p>
            <p className="text-sm">
              <span className="font-bold">Numéro d'enregistrement :</span> 48351
            </p>

            <p className="text-sm">
              <span className="font-bold">Directeur de la publication ::</span>{" "}
              Mr Bouzidi{" "}
            </p>
            <p className="text-sm">
              <span className="font-bold">Contact :</span>{" "}
              telephonedumonde1@gmail.com
            </p>
            <p className="text-sm">
              <span className="font-bold">Adresse postale :</span>
              KB WB Concept - FZCO, IFZA Properties, Dubai Silicon Oasis,
              Emirats Arabes Unis
            </p>

            <h3 className="font-bold">Hébergeur du site :</h3>
            <p className="text-sm">Nom de l&apos;hébergeur : Vercel</p>
            <p className="text-sm">Adresse : San Francisco</p>
            <p className="text-sm">Coordonnées : https://www.vercel.com</p>

            <h3 className="font-bold">Activité :</h3>
            <p className="text-sm">
              Téléphone du Monde est une société spécialisée dans la vente de
              téléphones mobiles provenant de différents pays (Japon, Inde,
              etc.) à destination du marché européen.{" "}
              <span className="font-bold">
                Les produits présentés sur le site sont importés et conformes à
                la réglementation en vigueur dans l'Union Européenne.
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-[2rem] font-bold">Propriété intellectuelle</h2>
            <p className="text-sm">
              L'ensemble des contenus présents sur le site Téléphone du Monde
              (textes, images, logos, éléments graphiques, etc.) est protégé par
              le droit de la propriété intellectuelle. Toute reproduction ou
              représentation, totale ou partielle, sans autorisation expresse,
              est interdite.
            </p>
            <p className="text-sm">
              Les logos et marques des sociétés citées sur le site Téléphone du
              Monde sont la propriété exclusive de leurs auteurs respectifs.
              Toutes représentations et/ou reproductions et/ou exploitation
              partielle ou totale de ce site, par quelques procédés que ce soit,
              sans l&apos;autorisation expresse et préalable de Téléphone du
              Monde est interdite et constituerait une contrefaçon au sens des
              articles L 335-2 et suivants du Code de la propriété
              intellectuelle.
            </p>
            <p className="text-sm">
              L&apos;élaboration de liens hypertextes profonds vers le site
              Téléphone du Monde est interdite sans l&apos;accord exprès et
              préalable de Téléphone du Monde. Par ailleurs, l&apos;utilisation
              des informations contenues sur le site relève de la seule
              responsabilité de l&apos;utilisateur. Nous ne pourrions en aucun
              cas, et pour quelque cause que ce soit, en être tenus pour
              responsables, et ce, quelque en soit les conséquences. Nous ne
              sommes responsables d&apos;aucune erreur ou omission sur le
              présent site.
            </p>
            <p className="text-sm">
              Les photos et les illustrations utilisées sur le site Téléphone du
              Monde sont la propriété de leurs auteurs respectifs. Toute
              reproduction totale ou partielle de ces éléments sans
              l&apos;autorisation expresse de leurs auteurs est interdite.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-[2rem] font-bold">
              Protection des données personnelles
            </h2>
            <p className="text-sm">
              L'ensemble des contenus présents sur le site Téléphone du Monde
              (textes, images, logos, éléments graphiques, etc.) est protégé par
              le droit de la propriété intellectuelle. Toute reproduction ou
              représentation, totale ou partielle, sans autorisation expresse,
              est interdite.
            </p>
            <p className="text-sm">
              Les logos et marques des sociétés citées sur le site Téléphone du
              Monde sont la propriété exclusive de leurs auteurs respectifs.
              Toutes représentations et/ou reproductions et/ou exploitation
              partielle ou totale de ce site, par quelques procédés que ce soit,
              sans l&apos;autorisation expresse et préalable de Téléphone du
              Monde est interdite et constituerait une contrefaçon au sens des
              articles L 335-2 et suivants du Code de la propriété
              intellectuelle.
            </p>
            <p className="text-sm">
              L&apos;élaboration de liens hypertextes profonds vers le site
              Téléphone du Monde est interdite sans l&apos;accord exprès et
              préalable de Téléphone du Monde. Par ailleurs, l&apos;utilisation
              des informations contenues sur le site relève de la seule
              responsabilité de l&apos;utilisateur. Nous ne pourrions en aucun
              cas, et pour quelque cause que ce soit, en être tenus pour
              responsables, et ce, quelque en soit les conséquences. Nous ne
              sommes responsables d&apos;aucune erreur ou omission sur le
              présent site.
            </p>
            <p className="text-sm">
              Les photos et les illustrations utilisées sur le site Téléphone du
              Monde sont la propriété de leurs auteurs respectifs. Toute
              reproduction totale ou partielle de ces éléments sans
              l&apos;autorisation expresse de leurs auteurs est interdite.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-[2rem] font-bold">Avertissement Général</h2>
            <p className="text-sm">
              La consultation du site Téléphone du Monde est proposée aux
              internautes à titre gratuit et sans aucune garantie de la part de
              son éditeur. Les informations disponibles sur ce site qui
              proviendrait de sources extérieures ne saurait garantir
              qu&apos;elles sont exemptes d&apos;erreurs, ni garantir leur
              complétude, leur actualité, leur exhaustivité ou autre.
            </p>
            <p className="text-sm">
              Les propriétaires des sites marchands, de services, sites persos,
              site informatiques (etc.) consultés à partir du site Téléphone du
              Monde sont seuls responsables du respect par eux de
              l&apos;ensemble des réglementations s&apos;appliquant dans le
              cadre des prestations offertes aux clients finaux, et notamment,
              des lois et réglements relatif à : la vente à distance, la
              protection du consommateur, la publicité mensongère ou trompeuse,
              les prix, la conformité des produits.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-[2rem] font-bold">Crédit & Copyright</h2>
            <p className="text-sm">
              Les crédits et copyright des visuels et des photos présents sur le
              blog Téléphone du Monde sont signalés lorsqu&apos;elles
              proviennent d&apos;un professionnel avec son accord.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-[2rem] font-bold">
              Loi applicable et juridiction compétente
            </h2>
            <p className="text-sm">
              Les présentes mentions légales sont soumises à la loi des Emirats
              Arabes Unis. En cas de litige, les tribunaux de Dubaï seront seuls
              compétents.
            </p>
            <p className="text-sm">
              Ces mentions légales peuvent être modifiées à tout moment, nous
              vous invitons donc à les consulter régulièrement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
