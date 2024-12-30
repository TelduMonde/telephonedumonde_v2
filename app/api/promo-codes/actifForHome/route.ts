import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//! RECUPERER LE DERNIER CODE PROMO CREE ET ACTIF
export const GET = async () => {
  try {
    // Récupération du dernier code promo créé et actif dans la base de données avec Prisma
    const promo = await prisma.promoCode.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!promo) {
      return NextResponse.json(
        { error: "Aucun code promo actif trouvé" },
        { status: 404 }
      );
    }

    // await prisma.promoCode.updateMany({
    //   where: {
    //     expiresAt: {
    //       lte: new Date(),
    //     },
    //     isActive: true,
    //   },
    //   data: {
    //     isActive: false,
    //   },
    // });

    return NextResponse.json(promo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
