import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//! RECUPERER TOUS LES MODELES ACTIFS
export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");
    const limit = Number(url.searchParams.get("limit")) || 8;
    const page = Number(url.searchParams.get("page")) || 1;
    const brand = url.searchParams.get("brand");

    const skipAmount = (Number(page) - 1) * limit;

    const models = await prisma.phoneModel.findMany({
      where: {
        isActive: true,
        name: {
          contains: query ?? "",
          mode: "insensitive",
        },
        brand: brand
          ? {
              contains: brand,
              mode: "insensitive",
            }
          : undefined,
      },
      skip: skipAmount,
      take: limit,
      include: {
        variants: {
          where: {
            isActive: true,
          },
          orderBy: {
            price: "asc", // Trier pour obtenir la première variante la moins chère
          },
          take: 1, // Récupérer uniquement la première variante
        },
      },
    });

    // Formater les données pour inclure la première image et le prix minimum
    const formattedModels = models.map((model) => {
      const firstVariant = model.variants[0];
      return {
        id: model.id,
        slug: model.slug,
        name: model.name,
        brand: model.brand,
        isActive: model.isActive,
        firstImage: firstVariant?.images?.[0] || null, // Première image de la première variante
        minPrice: firstVariant?.price || null, // Prix minimum (de la variante la moins chère)
      };
    });

    const modelsCount = await prisma.phoneModel.count({
      where: {
        isActive: true,
        name: {
          contains: query ?? "",
          mode: "insensitive",
        },
        brand: brand
          ? {
              contains: brand,
              mode: "insensitive",
            }
          : undefined,
      },
    });

    return NextResponse.json({
      data: formattedModels,
      totalPages: Math.ceil(modelsCount / limit),
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Echec lors de la récupération des modèles actifs." },
      { status: 500 }
    );
  }
};
