import React from "react";

export default function LivraisonRetour() {
  return (
    <section className="wrapper flex flex-col gap-10">
      <h1 className="sm:mt-2 font-font1 text-white uppercase text-base sm:text-4xl font-extrabold tracking-wide">
        Livraison & Retour
      </h1>
      <div className="h-[1px] w-2/3 bg-gradient-to-r from-white to-noir-900" />

      <div className="font-font1 text-white flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-[2rem]">1. Modes de Livraison</h2>
          <p className="text-sm">
            Nous proposons plusieurs modes de livraison pour répondre à vos
            besoins :
            <ul>
              <li>
                <strong>Livraison Standard :</strong> Livraison sous [nombre de
                jours] jours ouvrés.
              </li>
              <li>
                <strong>Livraison Express :</strong> Livraison sous [nombre de
                jours] jours ouvrés.
              </li>
            </ul>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[2rem]">2. Frais de Livraison</h2>
          <p className="text-sm">
            Les frais de livraison sont calculés en fonction du mode de
            livraison choisi et du montant total de la commande. Les frais de
            livraison sont indiqués au moment de la validation de la commande.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[2rem]">3. Délais de Livraison</h2>
          <p className="text-sm">
            Les délais de livraison indiqués sont des estimations et peuvent
            varier en fonction des disponibilités des produits et des
            contraintes logistiques. Nous faisons de notre mieux pour respecter
            les délais annoncés.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[2rem]">4. Suivi de Commande</h2>
          <p className="text-sm">
            Dès que votre commande est expédiée, vous recevrez un email de
            confirmation avec un numéro de suivi. Vous pourrez suivre
            l&apos;état de votre livraison sur le site de notre partenaire
            logistique.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[2rem]">5. Problèmes de Livraison</h2>
          <p className="text-sm">
            Si vous rencontrez un problème avec la livraison de votre commande
            (retard, colis endommagé, etc.), veuillez contacter notre service
            client à l&apos;adresse suivante : cf Rubrique CONTACT. Nous nous
            engageons à trouver une solution rapide et satisfaisante.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[2rem]">6. Droit de Rétractation</h2>
          <p className="text-sm">
            Conformément à la législation en vigueur, vous disposez d&aops;un
            délai de 14 jours à compter de la réception de votre commande pour
            exercer votre droit de rétractation sans avoir à justifier de motifs
            ni à payer de pénalités.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[2rem]">7. Procédure de Retour</h2>
          <p className="text-sm">
            Pour retourner un produit, veuillez suivre les étapes suivantes :
            <ol>
              <li>
                - Contactez notre service client à l&apos;adresse suivante :
                [Email de contact] pour obtenir un numéro de retour.
              </li>
              <li>
                - Emballez soigneusement le produit dans son emballage
                d&apos;origine, en parfait état, accompagné de la facture.
              </li>
              <li>
                - Envoyez le colis à l&apos;adresse suivante : [Adresse de
                retour].
              </li>
            </ol>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[2rem]">8. Conditions de Retour</h2>
          <p className="text-sm">
            Les produits doivent être retournés dans leur état d&apos;origine,
            non portés et non lavés, avec toutes les étiquettes attachées. Les
            articles retournés qui ne respectent pas ces conditions ne seront
            pas acceptés.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[2rem]">9. Frais de Retour</h2>
          <p className="text-sm">
            Les frais de retour sont à la charge du Client, sauf en cas de
            produit défectueux ou non conforme. Dans ce cas, le Vendeur prendra
            en charge les frais de retour.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[2rem]">10. Remboursements</h2>
          <p className="text-sm">
            Une fois le retour reçu et inspecté, nous vous enverrons un email
            pour vous notifier de la réception de votre article retourné. Nous
            vous informerons également de l&apos;approbation ou du rejet de
            votre remboursement. Si votre retour est approuvé, votre
            remboursement sera traité, et un crédit sera automatiquement
            appliqué à votre carte de crédit ou à votre méthode de paiement
            initiale, dans un délai de [nombre de jours] jours.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[2rem]">1. Modes de Livraison</h2>
          <p className="text-sm">
            Si vous souhaitez échanger un produit, veuillez suivre la procédure
            de retour et indiquer que vous souhaitez un échange. Une fois votre
            retour reçu et approuvé, nous vous enverrons le produit de
            remplacement. Les frais de réexpédition pour les échanges sont à la
            charge du Client.
          </p>
        </div>
      </div>
    </section>
  );
}
