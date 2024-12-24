import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentRole } from "@/lib/auth";

import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// function generateSlug(name: string): string {
//   return name
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// }

//! CREER UN MODELE
export const POST = async (req: NextRequest) => {
  try {
    const role = await currentRole();
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à effectuer cette action." },
        { status: 403 }
      );
    }

    const data = await req.json();

    const { name, brand, isActive } = data;

    // const slug = generateSlug(name);

    const existingModel = await prisma.phoneModel.findFirst({
      where: {
        name,
        brand,
      },
    });

    if (existingModel) {
      return NextResponse.json(
        { error: "Ce modèle existe déjà." },
        { status: 400 }
      );
    }

    if (!name || !brand) {
      return NextResponse.json(
        { error: "Veuillez renseigner tous les champs." },
        { status: 400 }
      );
    }

    const phoneModel = await prisma.phoneModel.create({
      data: {
        name,
        brand,
        isActive: isActive ?? true,
      },
    });

    revalidatePath("http://localhost:3000/admin-tel-du-monde/produits");
    return NextResponse.json(phoneModel);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

//! RECUPERER TOUS LES MODELES AVEC LE NOMBRE DE VARIANTS POUR ADMIN
export const GET = async (req: NextRequest) => {
  try {
    const role = await currentRole();
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à effectuer cette action." },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const query = url.searchParams.get("query");
    const limit = Number(url.searchParams.get("limit")) || 10;
    const page = Number(url.searchParams.get("page")) || 1;
    const brand = url.searchParams.get("brand");
    const skipAmount = (Number(page) - 1) * limit;

    const models = await prisma.phoneModel.findMany({
      where: {
        name: {
          contains: query ?? undefined,
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
        name: {
          contains: query ?? undefined,
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
      { error: "Echec lors de la récupération des modèles." },
      { status: 500 }
    );
  }
};
