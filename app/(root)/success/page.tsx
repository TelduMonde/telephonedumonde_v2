"use client";
/* eslint-disable react/no-unescaped-entities */
import { Transition } from "@/components/shared/Transition";
import { BottomGradient } from "@/components/ui/BottomGradient";
import { clearCart } from "@/lib/useCart";
import { useCurrentUser } from "@/lib/utils/use-current-user";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Paiement Réussie | Téléphones du Monde | Smartphones à Prix Réduits",
//   description:
//     "Découvrez le concept de Téléphones du Monde, la plateforme qui vous permet d'acheter des smartphones internationaux de qualité à des prix compétitifs. Qualité garantie, livraison rapide, et économies garanties.",
//   keywords: [
//     "concept smartphones",
//     "téléphones internationaux",
//     "téléphones pas chers",
//     "acheter téléphone neuf",
//     "smartphone prix réduit",
//     "qualité garantie",
//     "livraison rapide",
//     "économies garanties",
//   ],
// };

export default function SuccessPage() {
  const user = useCurrentUser();
  console.log(user);

  const orderId = localStorage.getItem("orderId");
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");

  console.log(orderId, userEmail, userName);

  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  console.log(orderNumber);

  useEffect(() => {
    if (orderNumber) {
      clearCart();
    }
  }, [orderNumber]);

  // useEffect(() => {
  //   const updatedOrderStatut = async () => {
  //     try {
  //       if (!orderId) {
  //         console.error("L'identifiant de la commande est requis.");
  //       }

  //       const response = await fetch("/api/orders/success", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           orderId,
  //           userEmail: user?.email || userEmail,
  //           userName: user?.name || userName,
  //         }),
  //       });
  //       if (!response.ok) {
  //         throw new Error("Échec de la mise à jour de la commande");
  //       }
  //     } catch (err) {
  //       console.error("Erreur lors de la mise à jour de la commande :", err);
  //     }
  //   };

  //   updatedOrderStatut();
  // }, [orderId, userEmail, userName, user?.email, user?.name]);

  return (
    <section className="wrapper flex flex-col gap-10">
      <h1 className="flex items-center gap-4 sm:mt-2 font-font1 text-white text-xl sm:text-4xl font-extrabold tracking-wide">
        <span className="text-xl font-thin font-fontb text-center inline-block p-4 border rounded-md text-white tracking-widest">
          Téléphone du monde
        </span>
      </h1>
      <div className="h-[1px] w-2/3 bg-gradient-to-r from-white to-noir-900" />

      <Transition>
        <section className="lg:w-2/3 mx-auto flex flex-col justify-center gap-4 lg:gap-10">
          <h2 className="font-font1 text-center text-white text-xl sm:text-4xl font-extrabold tracking-wide">
            MERCI POUR VOTRE COMMANDE !
          </h2>
          <div className="flex flex-col gap-4 bg-noir-700 p-4 rounded-md">
            <p className="text-white font-font1">
              Votre commande a été confirmé et est en cours de préparation. Un
              email de confirmation vous a été envoyé.
            </p>
            <p className="text-white font-font1">
              Numéro de commande :{" "}
              <span className="font-bold underline tracking-widest">
                {" "}
                {orderNumber}
              </span>{" "}
            </p>

            {/* AFFICHER LA COMMANDE */}
            <p></p>
          </div>
          <button className="bg-gradient-to-t px-2 relative group/btn from-primary-900 to-primary-500 block w-full md:w-1/3 mx-auto font-font1 uppercase text-white rounded-md h-10 font-medium">
            <Link href="/" className="">
              Retourner à l'accueil
            </Link>
            <BottomGradient />
          </button>
        </section>
      </Transition>
    </section>
  );
}
