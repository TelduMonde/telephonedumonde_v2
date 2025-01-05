import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

      const customerInfo = {
        name: session?.customer_details?.name,
        email: session?.customer_details?.email,
        address: session?.customer_details?.address,
      };

      // Récupérez l'ID de commande depuis metadata
      const orderId = session.metadata?.orderId;

      console.log("Commande ID :", orderId);

      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "PAID" },
      });

      // Récupérer les informations de la commande
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          orderNumber: true,
        },
      });

      // Envoyer un email de confirmation à l'utilisateur
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
          recipient: { name: customerInfo.name, address: customerInfo.email },
          subject: `Résumé de votre commande n°${order?.orderNumber} | Téléphones du Monde`,
          message: `Voici un résumé de votre commande : ${order?.id}, merci de votre achat !
          ${order?.orderNumber}, ${customerInfo.name}, ${customerInfo.email}, ${customerInfo.address}, ${lineItems}
          `,
        }),
      });

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la commande :", err);
      return NextResponse.json(
        { error: "Erreur interne du serveur" },
        { status: 500 }
      );
    }
  }
}
