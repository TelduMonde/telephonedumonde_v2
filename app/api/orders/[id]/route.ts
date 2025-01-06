import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentRole } from "@/lib/auth";

const prisma = new PrismaClient();

import { revalidatePath } from "next/cache";

//! SUPPRIMER UN MODELE
export const DELETE = async (req: NextRequest) => {
  try {
    // Vérifier si l'utilisateur est admin
    const role = await currentRole();
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à effectuer cette action." },
        { status: 403 }
      );
    }

    // Extraire l'ID depuis l'URL
    const id = req.url.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "ID de la commande manquant." },
        { status: 400 }
      );
    }

    // Supprimer le modèle avec Prisma
    const deletedOrder = await prisma.order.delete({
      where: { id },
    });

    revalidatePath("/admin-tel-du-monde/commandes");

    return NextResponse.json(deletedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
