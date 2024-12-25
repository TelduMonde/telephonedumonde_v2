import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

//! VALIDATION DU PANIER
export const POST = async (req: NextRequest) => {
  const { items, promoCode } = await req.json();

  console.log(items, promoCode);

  try {
    // Validation des articles
    for (const item of items) {
      const product = await prisma.phoneVariant.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return NextResponse.json(
          {
            error: `Le produit ${item.name} n'est plus disponible en quantité suffisante.`,
          },
          { status: 400 }
        );
      }
    }

    // Validation du code promo (si fourni)
    if (promoCode) {
      const code = await prisma.promoCode.findUnique({
        where: { code: promoCode },
      });

      if (!code || !code.isActive || new Date(code.expiresAt) < new Date()) {
        return NextResponse.json(
          { error: "Code promo invalide ou expiré." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ message: "Validation réussie" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
};
