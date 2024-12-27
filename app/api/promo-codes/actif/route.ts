import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//! RÉCUPÉRATION DE TOUS LES CODES PROMO
export const GET = async () => {
  try {
    // Récupère tous les codes promo
    const promoCodes = await prisma.promoCode.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ promoCodes });
  } catch (error) {
    console.error("Erreur lors de la récupération des codes promo :", error);
    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la récupération des codes promo.",
      },
      { status: 500 }
    );
  }
};
