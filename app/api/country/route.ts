import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentRole } from "@/lib/auth";

const prisma = new PrismaClient();

//! CREER UN PAYS
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
    const { name, imageUrl } = data;

    // VERIFIER SI LE PAY EXISTE DEJA
    const existingModel = await prisma.country.findFirst({
      where: {
        name,
        imageUrl,
      },
    });

    if (existingModel) {
      return NextResponse.json(
        { error: "Ce modèle existe déjà." },
        { status: 400 }
      );
    }

    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: "Veuillez renseigner tous les champs." },
        { status: 400 }
      );
    }

    const phoneModel = await prisma.country.create({
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(phoneModel);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const models = await prisma.country.findMany();
    return NextResponse.json(models);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
