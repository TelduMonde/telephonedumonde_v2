import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query) {
    return NextResponse.json({ models: [] });
  }

  const models = await prisma.phoneModel.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      brand: true,
    },
    take: 10, // Limiter le nombre de résultats
  });

  return NextResponse.json({ models });
}
