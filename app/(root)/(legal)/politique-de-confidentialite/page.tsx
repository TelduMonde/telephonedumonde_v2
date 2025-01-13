/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Politique de condidentialité | Téléphone du monde",
  description: "Politique de condidentialité du site Téléphone du monde",
};

export default function PolitiqueDeConfidentialite() {
  return (
    <section className="wrapper flex flex-col gap-10">
      <h1 className="sm:mt-2 font-font1 text-white uppercase text-base sm:text-4xl font-extrabold tracking-wide">
        Politique de condidentialité
      </h1>
      <div className="h-[1px] w-2/3 bg-gradient-to-r from-white to-noir-900" />

      <div className="font-font1 text-white flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold flex flex-col gap-2">
            {" "}
            Le but de cette Politique de Confidentialité est d&apos;informer les
            utilisateurs de notre site des données personnelles que nous
            recueillerons ainsi que les informations suivantes :
            <ul className="list-disc list-inside font-normal flex flex-col gap-2 font-base">
              <li>Les données personnelles recueillies</li>
              <li>L&apos;utilisation faite de ces données</li>
              <li>Les destinataires de ces données</li>
              <li>La durée de conservation de ces données</li>
              <li>Les droits des utilisateurs concernant ces données</li>
              <li>La politique du site en matière de cookies</li>
            </ul>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-font1 text-[2rem] font-bold">Loi Applicable</h2>
          <p className="text-sm">
            Conformément au Règlement général sur la protection des données
            (RGPD), cette politique de confidentialité est conforme aux
            régleements suivant.
          </p>
          <p className="text-sm flex flex-col gap-4 font-bold">
            Les données à caractère personnel doivent être :
            <ul className="list-disc list-inside font-normal flex flex-col gap-2 font-base">
              <li>
                Traitées de manière licite, loyale et transparente au regard de
                la personne concernée (licéité, loyauté, transparence) ;
              </li>
              <li>
                Collectées pour des finalités déterminées, explicites et
                légitimes, et ne pas être traotées ultérieurement d&apos;une
                manière incompatble avec ces finalités; le traitement ultérieur
                à des fin archivistiques dans l&apos;intérêt public, à des fins
                de recherche scientifique ou historique ou à des fins
                statistiques n&apos;est pas considéré, conformément à
                l&apos;article 89, paragraphe 1, comme incompatible avec les
                finalités initiales (limitation des finalités)
              </li>
              <li>
                Adéquates, pertinentes et limitées à ce qui est nécessare au
                regard des finalités pour lesquelles elles sont traitées
                (minimisation des données ;)
              </li>
              <li>
                Exactes et, si nécessaire, tenues à jour; toutes les mesures
                raisonnables doivent être prises pour que les données à
                caractère personnel qui sont inexactes, eu égard aux finalités
                pour lesquelles elles sont traitées, soient effacées ou
                rectifiées sans tarder (exactitude)
              </li>
              <li>
                Conservées sous une forme permettant l&apos;identification des
                personnes concernées pendant une durée n&apos;excédant pas celle
                nécessaire au regard des finalités pour lesquelles elles sont
                traitées; les données à caractère personnel peuvent être
                conservées pour des durées plus longues dans la mesure où elles
                seront traitées exclusivement à des fins archivistiques dans
                l&apos;intérêt public, à des fins de recherche scientifique ou
                historique ou à des fins statistiques conformément à
                l&apos;article 89, paragraphe 1, pour autant que soient mises en
                œuvre les mesures techniques et organisationnelles appropriées
                requises par le présent règlement en vue de garantir les droits
                et libertés de la personne concernée (limitation de la
                conservation)
              </li>
              <li>
                Traitées de manière à garantir une sécurité appropriée des
                données à caractère personnel, y compris la protection contre le
                traitement non autorisé ou illicite et contre la perte, la
                destruction ou les dégâts d&apos;origine accidentelle, à
                l&apos;aide de mesures techniques ou organisationnelles
                appropriées (intégrité et confidentialité).
              </li>
            </ul>
          </p>

          <p className="text-sm flex flex-col gap-4 font-bold">
            Le traitement n&apos;est licite que si, et dans la mesure où, au
            moins une des conditions suivantes est remplie :
            <ul className="list-disc list-inside font-normal flex flex-col gap-2 font-base">
              <li>
                La personne concernée a consenti au traitement de ses données à
                caractère personnel pour une ou plusieurs finalités spécifiques
              </li>
              <li>
                La traitement est nécessaire à l&apos;exécution d&apos;un
                contrat auquel la personne concernée est partie ou à
                l&apos;exécution de mesures précontractuelles prises à la
                demande de celle-ci
              </li>
              <li>
                Le traitement est nécessaire au respect d&apos;une obligation
                légale à laquelle le responsable du traitement est soumis
              </li>
              <li>
                Le traitement est nécessaire à la sauvegarde des intérêts vitaux
                de la personne concernée ou d&apos;une autre personne physique
              </li>
              <li>
                Le traitement est nécessaire à l&apos;exécution d&apos;une
                mission d&apos;intérêt public ou relevant de l&apos;exercice de
                l&apos;autorité publique dont est investi le responsable du
                traitement
              </li>
              <li>
                Le traitement est nécessaire aux fins des intérêts légitimes
                poursuivis par le responsable du traitement ou par un tiers, à
                moins que ne prévalent les intérêts ou les libertés et droits
                fondamentaux de la personne concernée qui exigent une protection
                des données à caractère personnel, notamment lorsque la personne
                concernée est un enfant.
              </li>
              <li>La durée de conservation de ces données</li>
              <li>Les droits des utilisateurs concernant ces données</li>
              <li>La politique du site en matière de cookies.</li>
            </ul>
          </p>
          <p className="text-sm">
            Pour les résidents de l&apos;Etat de Californie, cette politique de
            confidentialité vise à se conformer à la California Consumer Privacy
            Act (CCPA). S&apos;il y a des incohérences entre ce document et la
            CCPA, la législation de l&apos;Etat s&apos;appliquera. Si nous
            constatons des incohérences, nous modifierons notre politique pour
            nous conformer à la loi pertinente.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-font1 text-[2rem] font-bold">Consentement</h2>
          <p className="text-sm flex flex-col gap-4 font-bold">
            Les utilisateurs conviennent qu&apos;en utilisantt notre site, ils
            consentent à :
            <ul className="list-disc list-inside font-normal flex flex-col gap-2 font-base">
              <li>
                Les conditions énoncées dans la présente politique de
                confidentialité
              </li>
              <li>
                La collecte, l&apos;utilisation et la conservation des données
                énoncées dans la présente politique de confidentialité
              </li>
            </ul>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-font1 text-[2rem] font-bold">
            Données personnelles que nous collections
          </h2>
          <p className="text-sm">
            Données collectées automatiquement : Nous ne collections aucune
            donnée automatiquement sur notre site.
          </p>
          <p className="text-sm">
            Données recueillies de façon non automatique : Nous pouvons
            également collecter les donnéees suivantes lorsque vous effectuez
            certaines fonctions sur notre site : Nom, Prénom, Email, Adresse de
            livraison. Ces données peuvent être recueillies au moyen des
            méthodes suivantes : formulaire de contact, commandes. Ces données
            sont utilisées pour traiter et expédier vos commandes et vous
            fournir un service client efficace.
          </p>
          <p className="text-sm">
            Veuillez notez que nous ne collectons que les données qui nous
            aident à atteindre l&apos;objectif énoncé dans cette politique de
            confidentialité. Nous ne recueillerons pas de données
            supplémentaires sans vous informer au préalable.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-font1 text-[2rem] font-bold">
            Avec qui nous partagerons les données personnelles
          </h2>
          <p className="text-sm">
            Employés : les informations de contact pourront être utilisé par les
            personnes en charge de vous répondre ou de vous contacter.
          </p>
          <p className="text-sm">
            Autres divulgations : Nous nous engageons à ne pas vendre ou
            partager vos données avec des tiers, sauf dans les cas suivants : si
            la loi l&apos;exige, si elle est requise pour toute procédure
            judiciaire, pou rprouver ou protéger nos droits légaux, à des
            acheteurs ou des acheteurs potentiels de cette société dans le cas
            où nous cherchons à la vendre.
          </p>
          <p className="text-sm">
            Si vous suivez des hyperliens de notre site vers un autre site,
            veuillez noter que nous ne sommes pas responsables et n&apos;avons
            pas de contrôle sur leurs politiques et pratiques de
            confidentialité.{" "}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-font1 text-[2rem] font-bold">
            Comment nous protégeons vos données personnelles
          </h2>
          <p className="text-sm">
            Téléphone du Monde s'engage à respecter la vie privée de ses
            utilisateurs. Les données collectées sur le site sont traitées
            conformément à la Réglementation Générale sur la Protection des
            Données (RGPD) et à la législation des Emirats Arabes Unis.
            Responsable du traitement : KB WB Concept - FZCO
          </p>
          <p className="text-sm">
            <span className="font-bold underline">
              Responsable du traitement :
            </span>{" "}
            KB WB Concept - FZCO
          </p>
          <p className="text-sm">
            Nous prenons très au sérieux la sécurité de vos données personnelles
            et mettons en œuvre des mesures techniques et organisationnelles
            rigoureuses pour les protéger. Toutes les informations que vous nous
            fournissez sont stockées sur des serveurs sécurisés et sont
            protégées par des protocoles de sécurité avancés, tels que le
            cryptage SSL (Secure Socket Layer) pour garantir la confidentialité
            des données transmises. De plus, nous limitons l&apos;accès à vos
            données personnelles aux seuls employés, agents, et partenaires qui
            ont besoin d&apos;y accéder dans le cadre de leurs fonctions et qui
            sont tenus à une stricte obligation de confidentialité. Nous
            effectuons régulièrement des audits de sécurité et mettons à jour
            nos pratiques pour nous assurer que vos informations restent
            sécurisées. Enfin, en cas de suspicion de violation de la sécurité
            des données, nous avons mis en place des procédures pour gérer et
            minimiser l&apos;impact de telles situations, y compris la
            notification rapide des utilisateurs concernés et des autorités
            compétentes si nécessaire.
          </p>
          <p className="text-sm">
            Alors que nous prenons toutes les précautions raisonnables pour nous
            assurer que nos données d&apos;utilisateur sont sécurisées et que
            les utilisateurs sont protégés, il reste toujours du risque de
            préjudice. L&apos;Internet en sa totalité peut être, parfois, peu
            sûr et donc nous sommes incapables de garantir la sécurité des
            données des utilisateurs au-delà de ce qui est raisonnablement
            pratique.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-font1 text-[2rem] font-bold">Mineurs</h2>
          <p className="text-sm">
            Le RGPD précise que les personnes de moins de 15 ans sont
            considérées comme des mineurs aux fins de la collecte de données.
            Les mineurs doivent avoir le consentement d&apos;un représentant
            légal pour que leurs données soient recueillies, traitées et
            utilisées.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-font1 text-[2rem] font-bold">
            Vos droits en tant qu&apos;utilisateur
          </h2>
          <p className="text-sm flex flex-col gap-4 font-bold">
            En vertu du RGPD, les utilisateurs ont les droits suivant en tant
            que personnes concernées :
            <ul className="list-disc list-inside font-normal flex flex-col gap-2 font-base">
              <li>Droit d&apos;accès</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement</li>
              <li>Droit de restreindre le traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d&apos;objection</li>
            </ul>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-font1 text-[2rem] font-bold">
            Comment modifier, supprimer ou contester les données recueillies
          </h2>
          <p className="text-sm">
            Si vous souhaitez que vos renseignements soient supprimés ou
            modifiés d&apos;une façon ou d&apos;une autre, veuillez communiquer
            avec notre agent de protection de la vie privée ici : cf rubrique
            contact.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-font1 text-[2rem] font-bold">Modifications</h2>
          <p className="text-sm">
            Cette politique de confidentialité peut être modifiée à
            l&apos;occasion afin de maintenir la conformité avec la loi et de
            tenir compte de tout changement à notre processus de collecte de
            données. Nous recommandons à nos utilisateurs de vérifier notre
            politique de temps à autre pour s&apos;assurrer qu&apos;ils soient
            informés de toute mise à jour. Au besoin, nous pouvons informer les
            utlisateurs par courriel des changements apportés à cette politique.
          </p>
        </div>
      </div>
    </section>
  );
}
