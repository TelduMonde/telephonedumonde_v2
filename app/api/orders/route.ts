import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentRole } from "@/lib/auth";
import { subDays, startOfYear } from "date-fns";

const prisma = new PrismaClient();

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
    const statut = url.searchParams.get("statut");
    const dateRange = url.searchParams.get("dateRange");
    const orderBy =
      url.searchParams.get("orderBy") === "asc" ||
      url.searchParams.get("orderBy") === "desc"
        ? url.searchParams.get("orderBy")
        : "desc";
    const limit = Number(url.searchParams.get("limit")) || 10;
    const page = Number(url.searchParams.get("page")) || 1;
    const skipAmount = (Number(page) - 1) * limit;

    let dateFilter = {};

    if (dateRange) {
      const now = new Date();
      switch (dateRange) {
        case "24h":
          dateFilter = {
            createdAt: {
              gte: subDays(now, 1),
            },
          };
          break;
        case "7d":
          dateFilter = {
            createdAt: {
              gte: subDays(now, 7),
            },
          };
          break;
        case "30d":
          dateFilter = {
            createdAt: {
              gte: subDays(now, 30),
            },
          };
          break;
        case "90d":
          dateFilter = {
            createdAt: {
              gte: subDays(now, 90),
            },
          };
          break;
        case "1y":
          dateFilter = {
            createdAt: {
              gte: startOfYear(now),
            },
          };
          break;
        default:
          dateFilter = {};
      }
    }

    const orders = await prisma.order.findMany({
      where: {
        AND: [
          statut
            ? {
                statut: {
                  contains: statut,
                  mode: "insensitive",
                },
              }
            : {},
          dateFilter,
        ],
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
      orderBy: { createdAt: orderBy as "asc" | "desc" },
      skip: skipAmount,
      take: limit,
    });

    const ordersCount = await prisma.order.count({
      where: {
        statut: statut
          ? {
              contains: statut,
              mode: "insensitive",
            }
          : undefined,
      },
    });

    return NextResponse.json({
      data: orders,
      totalPages: Math.ceil(ordersCount / limit),
    });
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
