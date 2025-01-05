import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const { orderId, userEmail, userName } = await req.json();

  console.log(orderId, userEmail, userName);

  try {
    if (!orderId) {
      return NextResponse.json(
        {
          error: "L'identifiant de la commande est requis.",
        },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { statut: "PAID" },
    });

    await fetch(`${process.env.BASE_URL}/api/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Téléphone du monde",
          address: "no-reply@telephonedumonde.com",
        },
        recipient: { name: userName, address: userEmail },
        subject: "Résumé de votre commande | Téléphones du Monde",
        message: `Voici un résumé de votre commande : ${updatedOrder.id}`,
      }),
    });

    return NextResponse.json(updatedOrder);
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la commande :", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
};
