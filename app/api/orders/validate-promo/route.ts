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
    let total = 0;
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

      // Calculer le total des articles
      total += product.price * item.quantity;
    }

    // Validation du code promo (si fourni)
    let discount = 0;
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

      // Calculer la réduction
      discount = (total * code.discount) / 100;
    }

    // Calculer le total après réduction
    const totalAfterDiscount = total - discount;

    return NextResponse.json({
      message: "Validation réussie",
      total: totalAfterDiscount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
};
