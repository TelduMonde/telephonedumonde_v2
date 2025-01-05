import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentRole } from "@/lib/auth";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const role = await currentRole();
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à effectuer cette action." },
        { status: 403 }
      );
    }

    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            Variant: {
              select: {
                images: true,
                model: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de la récupération des commandes.",
      },
      { status: 500 }
    );
  }
};
