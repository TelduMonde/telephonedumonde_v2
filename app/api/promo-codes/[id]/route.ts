import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentRole } from "@/lib/auth";

const prisma = new PrismaClient();

import { revalidatePath } from "next/cache";

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

    return NextResponse.json(promo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

//! MODIFIER UN CODE PROMO
export const PUT = async (req: NextRequest) => {
  try {
    // Vérifier le rôle de l'utilisateur
    const role = await currentRole();
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à effectuer cette action." },
        { status: 403 }
      );
    }

    // Extraire l'ID depuis l'URL
    const id = req.url.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // Lire et parser le corps de la requête
    const body = await req.json();
    const { code, discount, isActive, expiresAt } = body;

    // Vérification des données reçues
    if (!code || !discount || typeof isActive === "undefined" || !expiresAt) {
      return NextResponse.json(
        { error: "Données manquantes ou invalides." },
        { status: 400 }
      );
    }

    // Mise à jour dans la base de données avec Prisma
    const updatedPromo = await prisma.promoCode.update({
      where: { id },
      data: {
        code,
        discount,
        isActive,
        expiresAt: new Date(expiresAt),
      },
    });

    revalidatePath("http://localhost:3000/admin-tel-du-monde");
    return NextResponse.json(updatedPromo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

//! SUPPRIMER UN MODELE
export const DELETE = async (req: NextRequest) => {
  try {
    // Vérifier le rôle de l'utilisateur
    const role = await currentRole();
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à effectuer cette action." },
        { status: 403 }
      );
    }

    // Extraire l'ID depuis l'URL
    const id = req.url.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // Suppression dans la base de données avec Prisma
    await prisma.promoCode.delete({ where: { id } });

    revalidatePath("http://localhost:3000/admin-tel-du-monde");
    return NextResponse.json(
      { success: "Code promo supprimé" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
