import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const url = new URL(req.url);
    const { slug } = await params;

    // Récupérer les filtres depuis l'URL
    const color = url.searchParams.get("color");
    const memory = url.searchParams.get("memory");
    const country = url.searchParams.get("country");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug du modèle manquant." },
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

    const modelId = model.id;

    // Construire les filtres dynamiquement
    const filters: {
      modelId: string;
      color?: string;
      memory?: number;
      countryId?: string;
    } = { modelId };
    if (color) filters.color = color;
    if (memory) filters.memory = Number(memory);
    if (country) filters.countryId = country;

    // Récupérer les variantes filtrées
    const variants = await prisma.phoneVariant.findMany({
      where: filters,
      include: {
        model: true,
        country: true, // Inclure le pays dans la relation
      },
    });

    // Si aucune variante trouvée, retourner une erreur
    if (!variants.length) {
      return NextResponse.json(
        { error: "Aucune variante ne correspond aux critères." },
        { status: 404 }
      );
    }

    // Collecter toutes les variantes pour obtenir les options uniques
    const allVariants = await prisma.phoneVariant.findMany({
      where: { modelId, isActive: true },
      include: {
        country: true, // Inclure les relations avec le pays
      },
    });

    // Collecter les couleurs, mémoires et pays uniques
    const uniqueColors = Array.from(new Set(allVariants.map((v) => v.color)));
    const uniqueMemories = Array.from(
      new Set(allVariants.map((v) => v.memory))
    );
    const uniqueCountries = Array.from(
      new Map(
        allVariants
          .filter((v) => v.country) // Assurez-vous que le pays est défini
          .map((v) => [
            v.country?.id,
            { id: v.country?.id, name: v.country?.name },
          ])
      ).values()
    );

    return NextResponse.json({
      filteredVariants: variants,
      options: {
        colors: uniqueColors,
        memories: uniqueMemories,
        countries: uniqueCountries, // Inclure l'ID et le nom du pays
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Echec lors de la récupération des modèles." },
      { status: 500 }
    );
  }
};
