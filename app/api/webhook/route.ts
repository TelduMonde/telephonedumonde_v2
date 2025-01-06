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

  // console.log("BODY", body);
  // console.log("HEADERLIST", headersList);
  // console.log("SIG", sig);

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

      // Récupération des informations de livraison
      const shippingCost = session.total_details?.amount_shipping || 0; // Frais en centimes

      // Récupérez l'ID de commande depuis metadata
      const orderId = session.metadata?.orderId;

      console.log("Commande ID :", orderId);
      console.log("Informations client :", customerInfo);

      // Récupérer le coût total de la commande
      const totalCost = (session.amount_total ?? 0) / 100; // Total incluant la livraison

      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "paid",
          price: totalCost,
          deliveryInfos: { cost: shippingCost / 100 },
        },
      });

      // Récupérer les informations de la commande
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          orderNumber: true,
        },
      });

      const htmlMessage = `
      <!DOCTYPE html>
      <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Asap:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Asap', sans-serif;
            background-color: #0a0a0a;
            margin: 0;
            padding: 0;
            color: #ffffff;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #0a0a0a;
            padding: 20px;
            border-radius: 8px;
            color: #ffffff;
          }
          .header {
            background-color: #b80b07;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 100;
            border: 1px solid #fff; /* Bordure blanche */
            border-radius: 5px; /* Rayon de bordure de 5px */
            padding: 6px; /* Padding de 4px */
          }
          .logo {
            max-width: 100px;
            margin: 10px auto;
          }
          .content {
            margin: 20px 0;
          }
          .content p {
            line-height: 1.6;
            color: #ffffff;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            margin-top: 20px;
          }
          .product-image {
            max-width: 100%;
            border-radius: 8px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
         
            <h1>Téléphones du Monde</h1>
          </div>
          <div class="content">
            <p>Bonjour <strong>${customerInfo.name}</strong>,</p>
            <p>Merci pour votre commande n°<strong>${
              order?.orderNumber
            }</strong> !</p>
            <p>Voici les détails :</p>
            <ul>
              <li><strong>Nom :</strong> ${customerInfo.name}</li>
              <li><strong>Email :</strong> ${customerInfo.email}</li>
      ${
        customerInfo.address
          ? `<li><strong>Adresse :</strong> ${customerInfo.address.line1}, ${
              customerInfo.address.line2 || ""
            }, ${customerInfo.address.postal_code}, ${
              customerInfo.address.city
            }, ${customerInfo.address.country}</li>`
          : "<li><strong>Adresse :</strong> Non disponible</li>"
      }
      <li><strong>Livraison :</strong> ${shippingCost / 100} €</li>
              <li><strong>Produits :</strong></li>
            </ul>
            <ul>
              ${(lineItems.data || [])
                .map(
                  (item) =>
                    `<li>
                      <strong>${item.description}</strong> - ${
                      item.amount_total / 100
                    } €
                      
                    </li>`
                )
                .join("")}
            </ul>
            <p><strong>Total de la commande :</strong> ${totalCost} €</p>
            <p>Merci encore pour votre confiance. Nous espérons vous revoir bientôt !</p>
          </div>
          <div class="footer">
            © 2025 Téléphones du Monde - Tous droits réservés
          </div>
        </div>
      </body>
      </html>
      `;

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
          message: htmlMessage,
        }),
      });

      // Envoyer un email de confirmation à vous-même
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
          recipient: { name: "CJ", address: "inthegleam01@gmail.com" },
          subject: `Nouvelle Commande : n°${order?.orderNumber} | Téléphones du Monde`,
          message: htmlMessage,
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
