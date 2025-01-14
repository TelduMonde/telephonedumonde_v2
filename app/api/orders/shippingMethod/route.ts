import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const shippingMethods = await prisma.shippingMethod.findMany();
    console.log(shippingMethods);
    return NextResponse.json(shippingMethods);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
