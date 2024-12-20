import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const brands = await prisma.phoneModel.findMany({
      select: {
        brand: true,
      },
    });

    const uniqueBrands = Array.from(
      new Set(brands.map((model) => model.brand))
    );

    return NextResponse.json({
      uniqueBrands,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Echec lors de la récupération des marques." },
      { status: 500 }
    );
  }
};
