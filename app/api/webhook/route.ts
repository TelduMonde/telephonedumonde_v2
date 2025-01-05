import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Clé secrète du webhook manquante" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    } else {
      console.error("Webhook Error: Unknown error");
      return NextResponse.json(
        { error: "Webhook Error: Unknown error" },
        { status: 400 }
      );
    }
  }

  const session = event.data.object as Stripe.Checkout.Session;
  console.log("Checkout session completed", session);

  if (event.type === "checkout.session.completed") {
    try {
      // Voir pour récupérer la commande
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          limit: 20,
        }
      );

      console.log("Order", lineItems);

      // const updatedOrder = await prisma.order.update({
      //   where: { id: session.client_reference_id },
      //   data: { statut: "PAID" },
      // });

      // // Récupérer les informations de la commande
      // const order = await prisma.order.findUnique({
      //   where: { id: session.client_reference_id },
      //   select: {
      //     id: true,
      //     orderNumber: true,
      //   },
      // });

      // Envoyer un email de confirmation à l'utilisateur (optionnel)
      // ...

      // return NextResponse.json(updatedOrder);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la commande :", err);
      return NextResponse.json(
        { error: "Erreur interne du serveur" },
        { status: 500 }
      );
    }
  }
}
