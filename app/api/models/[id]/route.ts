import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentRole } from "@/lib/auth";

const prisma = new PrismaClient();

import { revalidatePath } from "next/cache";

//! RECUPERER UN SEUL MODELE
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID du modèle manquant." },
        { status: 400 }
      );
    }

    const model = await prisma.phoneModel.findUnique({
      where: {
        id: id,
      },
      include: {
        variants: true,
      },
    });

    if (!model) {
      return NextResponse.json(
        { error: "Modèle introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json(model);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

//! MODIFIER UN MODELE
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
      return NextResponse.json(
        { error: "ID du modèle manquant." },
        { status: 400 }
      );
    }

    // Lire et parser le corps de la requête
    const body = await req.json();
    const { name, brand, isActive } = body;

    // Vérification des données reçues
    if (!name || !brand || typeof isActive === "undefined") {
      return NextResponse.json(
        { error: "Données manquantes ou invalides." },
        { status: 400 }
      );
    }

    // Mise à jour dans la base de données avec Prisma
    const updatedModel = await prisma.phoneModel.update({
      where: { id },
      data: {
        name,
        brand,
        isActive,
      },
    });

    return NextResponse.json(updatedModel, { status: 200 });
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
    // Vérifier si l'utilisateur est admin
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
      return NextResponse.json(
        { error: "ID du modèle manquant." },
        { status: 400 }
      );
    }

    // Supprimer le modèle avec Prisma
    const deletedModel = await prisma.phoneModel.delete({
      where: { id },
    });

    revalidatePath("http://localhost:3000/admin-tel-du-monde/produits");

    return NextResponse.json(deletedModel, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
