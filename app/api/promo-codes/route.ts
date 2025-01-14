import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { revalidatePath } from "next/cache";
import { currentRole } from "@/lib/auth";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    const role = await currentRole();
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à effectuer cette action." },
        { status: 403 }
      );
    }
    // Parse le corps de la requête
    const body = await req.json();

    const { code, discount, isActive, isShippedFree, expiresAt, userId } = body;

    // Validation des données
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Le code est requis et doit être une chaîne de caractères." },
        { status: 400 }
      );
    }

    if (
      discount === undefined ||
      typeof discount !== "number" ||
      discount > 100
    ) {
      return NextResponse.json(
        {
          error:
            "Le pourcentage de réduction doit être un nombre entre 1 et 100.",
        },
        { status: 400 }
      );
    }

    if (!expiresAt || isNaN(new Date(expiresAt).getTime())) {
      return NextResponse.json(
        { error: "La date d'expiration est invalide." },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "L'ID utilisateur est requis." },
        { status: 400 }
      );
    }

    // Création du code promo
    const promoCode = await prisma.promoCode.create({
      data: {
        code,
        discount,
        isActive: isActive ?? true, // Par défaut actif
        isShippedFree: isShippedFree ?? false, // Par défaut non
        expiresAt: new Date(expiresAt),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Réponse réussie
    revalidatePath("http://localhost:3000/admin-tel-du-monde");
    return NextResponse.json(
      { message: "Code promo créé avec succès.", promoCode },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du code promo :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création du code promo." },
      { status: 500 }
    );
  }
};

//! RÉCUPÉRATION DE TOUS LES CODES PROMO
export const GET = async () => {
  try {
    const role = await currentRole();
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à effectuer cette action." },
        { status: 403 }
      );
    }

    const now = new Date();

    await prisma.promoCode.updateMany({
      where: {
        expiresAt: {
          lte: now,
        },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Récupère tous les codes promo
    const promoCodes = await prisma.promoCode.findMany({
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
