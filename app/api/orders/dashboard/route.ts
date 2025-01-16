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

    // Filtrer les items sans Variant et les commandes sans items valides
    const filteredOrders = orders
      .map((order) => ({
        ...order,
        items: order.items.filter((item) => item.Variant !== null),
      }))
      .filter((order) => order.items.length > 0);

    return NextResponse.json(filteredOrders, { status: 200 });
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
