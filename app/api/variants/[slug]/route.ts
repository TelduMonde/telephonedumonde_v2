import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Récupérer les variants d'un produit
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const url = new URL(req.url);
    const { slug } = await params;

    const limit = Number(url.searchParams.get("limit")) || 10; // Par défaut : 10
    const page = Number(url.searchParams.get("page")) || 1; // Par défaut : page 1
    const skipAmount = (page - 1) * limit;

    if (!slug) {
      return NextResponse.json(
        { error: "ID du modèle manquant." },
        { status: 400 }
      );
    }

    // Récupérer le modèle par son slug
    const model = await prisma.phoneModel.findUnique({
      where: { slug },
    });

    if (!model) {
      return NextResponse.json(
        { error: "Modèle non trouvé." },
        { status: 404 }
      );
    }

    const id = model?.id;

    // Récupérer les variantes avec pagination
    const variants = await prisma.phoneVariant.findMany({
      where: {
        modelId: id,
      },
      skip: skipAmount, // Sauter les éléments des pages précédentes
      take: limit, // Limiter le nombre de résultats
      include: {
        model: true,
        country: true,
      },
    });

    // Compter le nombre total de variantes pour la pagination
    const totalVariants = await prisma.phoneVariant.count({
      where: {
        modelId: id,
      },
    });

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(totalVariants / limit);

    return NextResponse.json({
      data: variants, // Variantes paginées
      totalVariants, // Nombre total de variantes
      totalPages, // Nombre total de pages
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Echec lors de la récupération des variantes." },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
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

    const {
      modelSlug,
      memory,
      color,
      countryId,
      price,
      description,
      stock,
      isActive,
      images,
    } = await req.json();

    if (
      !modelSlug ||
      !memory ||
      !color ||
      !price ||
      !images ||
      images.length === 0
    ) {
      return NextResponse.json(
        { error: "Paramètres obligatoires manquants." },
        { status: 400 }
      );
    }

    const model = await prisma.phoneModel.findUnique({
      where: { slug: modelSlug },
    });

    if (!model) {
      return NextResponse.json(
        { error: "Modèle introuvable." },
        { status: 404 }
      );
    }

    const modelId = model.id;

    const newVariant = await prisma.phoneVariant.create({
      data: {
        modelId,
        memory,
        color,
        countryId,
        price,
        description: description || "",
        //caract: caract || "",
        stock: stock || 0,
        isActive: isActive ?? true,
        images,
      },
    });

    return NextResponse.json(newVariant, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la variante :", error);
    return NextResponse.json(
      { error: "Echec lors de la création de la variante.", details: error },
      { status: 500 }
    );
  }
};

//! MODIFIER UNE VARIANTE
export const PUT = async (req: NextRequest) => {
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

    if (!variant) {
      return NextResponse.json(
        { error: "Variante introuvable." },
        { status: 404 }
      );
    }

    // Supprimer les images marquées pour suppression
    // Respecter l'ordre défini par le client
    const updatedImages = images.filter(
      (url: string) => !imagesToDelete.includes(url)
    );

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

    return NextResponse.json(updatedVariant, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la variante :", error);
    return NextResponse.json(
      { error: "Échec lors de la mise à jour de la variante.", details: error },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const role = await currentRole();
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à effectuer cette action." },
        { status: 403 }
      );
    }

    const { variantId } = await req.json();
    const { slug } = await params;

    if (!variantId) {
      return NextResponse.json(
        { error: "ID de la variante manquant." },
        { status: 400 }
      );
    }

    await prisma.phoneVariant.delete({
      where: { id: variantId },
    });

    revalidatePath(`/admin-tel-du-monde/produits/${slug}`);
    return NextResponse.json({ message: "Variante supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la variante :", error);
    return NextResponse.json(
      { error: "Echec lors de la suppression de la variante.", details: error },
      { status: 500 }
    );
  }
};
