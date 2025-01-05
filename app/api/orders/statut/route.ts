import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PUT = async (req: NextRequest) => {
  const { orderId, statut } = await req.json();

  console.log("orderId", orderId);

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { statut },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
};
