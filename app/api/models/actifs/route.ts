import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//! RECUPERER TOUS LES MODELES ACTIFS
export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");
    const limit = Number(url.searchParams.get("limit")) || 10;
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
      include: {
        variants: {
          select: {
            _count: true,
          },
        },
      },
      skip: skipAmount,
      take: limit,
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

    const modelsWithVariantCount = models.map((model) => ({
      ...model,
      variantCount: model.variants.length,
    }));

    return NextResponse.json({
      data: modelsWithVariantCount,
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
