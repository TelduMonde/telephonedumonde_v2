import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis." },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId },
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
