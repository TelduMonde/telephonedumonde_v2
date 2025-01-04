import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentRole } from "@/lib/auth";
// import { revalidatePath } from "next/cache";
// import { use } from "react";

const prisma = new PrismaClient();

//! MODIFIER UNE VARIANTE
export const PATCH = async (req: NextRequest) => {
  try {
    const role = await currentRole();
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à effectuer cette action." },
        { status: 403 }
      );
    }

    if (!req.body) {
      return NextResponse.json(
        { error: "Corps de la requête manquant." },
        { status: 400 }
      );
    }

    // Vérifier et parser le JSON
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Format JSON invalide." },
        { status: 400 }
      );
    }

    const {
      variantId,
      memory,
      color,
      countryId,
      price,
      description,
      stock,
      isActive,
      images,
      imagesToDelete,
    } = body;

    if (!variantId || !memory || !color || !price) {
      return NextResponse.json(
        { error: "Paramètres obligatoires manquants." },
        { status: 400 }
      );
    }

    // Récupérer les images existantes
    const variant = await prisma.phoneVariant.findUnique({
      where: { id: variantId },
      select: { images: true },
    });

    if (variant) {
      console.log("Variante trouvée :", variant);
    }

    if (!variant) {
      return NextResponse.json(
        { error: "Variante introuvable." },
        { status: 404 }
      );
    }

    // Supprimer les images marquées pour suppression
    const remainingImages = variant.images.filter(
      (url) => !imagesToDelete.includes(url)
    );

    // Ajouter uniquement les nouvelles images qui ne sont pas à supprimer
    const filteredNewImages: string[] = (images || []).filter(
      (url: string) => !imagesToDelete.includes(url)
    );
    const updatedImages = [
      ...new Set([...remainingImages, ...filteredNewImages]),
    ];

    // Mettre à jour la variante
    const updatedVariant = await prisma.phoneVariant.update({
      where: { id: variantId },
      data: {
        memory,
        color,
        countryId,
        price,
        description: description || "",
        stock: stock || 0,
        isActive: isActive ?? true,
        images: updatedImages, // Mise à jour avec les images restantes et les nouvelles
      },
    });

    console.log("Variante mise à jour :", updatedVariant);

    return NextResponse.json(updatedVariant, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la variante :", error);
    return NextResponse.json(
      { error: "Échec lors de la mise à jour de la variante.", details: error },
      { status: 500 }
    );
  }
};
