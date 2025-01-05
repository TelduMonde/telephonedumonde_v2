import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { startOfWeek, endOfWeek } from "date-fns";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 }); // Lundi
    const end = endOfWeek(now, { weekStartsOn: 1 }); // Dimanche

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
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

    return NextResponse.json(orders, { status: 200 });
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
