import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentRole } from "@/lib/auth";

const prisma = new PrismaClient();

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const { images } = await req.json();
  console.log(images);
  console.log(id);

  if (!id || !images || !Array.isArray(images)) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }

  try {
    const role = await currentRole();
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à effectuer cette action." },
        { status: 403 }
      );
    }
    // Mettre à jour l'ordre des images de la variante
    const updatedVariant = await prisma.phoneVariant.update({
      where: { id },
      data: { images },
    });

    return NextResponse.json(updatedVariant, { status: 200 });
  } catch (error) {
    console.error("Failed to update image order", error);
    return NextResponse.json(
      { error: "Failed to update image order" },
      { status: 500 }
    );
  }
};
