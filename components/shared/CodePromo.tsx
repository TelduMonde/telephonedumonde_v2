"use client";
import { PromoCode } from "@/types";
import React, { useEffect, useState } from "react";

export default function CodePromo() {
  const [promoCode, setPromoCode] = useState<PromoCode>({
    id: "",
    code: "",
    discount: 0,
    isActive: false,
    expiresAt: new Date(),
    isShippedFree: false,
  });

  useEffect(() => {
    const fetchActivePromo = async () => {
      try {
        const response = await fetch(`/api/promo-codes/actifForHome`, {
          headers: {
            method: "GET",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching models:", errorData);
          throw new Error("Failed to fetch models");
        }

        const data = await response.json();
        setPromoCode(data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchActivePromo();
  }, []);

  const isExpired = new Date(promoCode.expiresAt) < new Date();

  if (!promoCode || !promoCode.isActive || isExpired) {
    return null;
  }

  if (promoCode.isShippedFree) {
    return (
      <div className="bg-gradient-to-r from-primary-500 to-primary-900 p-1">
        <p className="text-center text-white font-font1 uppercase text-xs sm:text-sm tracking-widest font-bold">
          Livraison gratuite avec le code{" "}
          <span className="underline">{promoCode.code}</span> ! PROFITEZ-EN dès
          maintenant
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-900 p-1">
      <p className="text-center text-white font-font1 uppercase text-xs sm:text-sm tracking-widest font-bold">
        {promoCode.discount} % de réduction avec le code{" "}
        <span className="underline">{promoCode.code}</span> ! PROFITEZ-EN dès
        maintenant
      </p>
    </div>
  );
}
