"use client";

import { PromoCode } from "@/types";
import { useEffect, useState } from "react";
import EditPromoCodeBtn from "./EditPromoCodeBtn";
import DeletePromoCodeBtn from "./DeletePromoCodeBtn";

export default function ShowActifPromo() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPromoCodes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/promo-codes/actif", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching promo codes:", errorData);
          throw new Error("Failed to fetch promo codes");
        }

        const data = await response.json();
        // console.log("PROMO CODES", data);
        setPromoCodes(data.promoCodes);
      } catch (error) {
        console.error("Error fetching promo codes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromoCodes();
  }, []);

  console.log("PROMO CODES", promoCodes);

  return (
    <div>
      {isLoading && (
        <p className="bg-noir-800 text-white font-font1 p-2 text-xs text-center rounded-md">
          Chargement...
        </p>
      )}

      {promoCodes.length > 0 ? (
        <ul className="bg-noir-800 text-white font-font1 p-1 text-xs text-center rounded-md flex flex-col gap-1">
          {promoCodes.map((promo) => (
            <li
              key={promo.id}
              className="bg-noir-700 grid grid-cols-6 p-2 rounded-md"
            >
              <p>Code: {promo.code}</p>
              <p>Réduction: {promo.discount}%</p>
              <p>Livraison gratuite : {promo.isShippedFree ? "OUI" : "NON"}</p>
              <p>Statut: {promo.isActive ? "Actif" : "Expiré"}</p>
              <p>
                Date d&apos;expiration:{" "}
                {new Date(promo.expiresAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2 justify-center">
                <EditPromoCodeBtn promoCode={promo} promoCodeId={promo.id} />
                <DeletePromoCodeBtn promoCodeId={promo.id} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="bg-noir-800 text-white font-font1 p-2 text-xs text-center rounded-md">
          Aucun code promo actif.
        </p>
      )}
    </div>
  );
}
