/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

// import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const {
    items,
    contactEmail,
    contactPhone,
    address,
    promoCode,
    deliveryMethod,
  } = await req.json();

  try {
    // Validation des champs obligatoires
    if (!contactEmail || !contactPhone || !address) {
      return NextResponse.json(
        {
          error: "Les informations de contact et d'adresse sont obligatoires.",
        },
        { status: 400 }
      );
    }

    // Validation des stocks
    for (const item of items) {
      const product = await prisma.phoneVariant.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return NextResponse.json(
          {
            error: `Le produit ${item.name} n'est plus disponible en quantité suffisante.`,
          },
          { status: 400 }
        );
      }

      // if (!product || product.stock < item.quantity) {
      //   return NextResponse.json(
      //     {
      //       error: `Le produit ${item.name} n'est plus disponible en quantité suffisante.`,
      //     },
      //     { status: 400 }
      //   );
      // }
    }

    // Validation du code promo (si fourni)
    let discount = 0;
    if (promoCode) {
      const code = await prisma.promoCode.findUnique({
        where: { code: promoCode },
      });

      if (!code || !code.isActive || new Date(code.expiresAt) < new Date()) {
        return NextResponse.json(
          { error: "Code promo invalide ou expiré." },
          { status: 400 }
        );
      }

      discount = code.discount;
    }

    // Calcul des coûts
    const subTotal = items.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0
    );
    const deliveryCost = deliveryMethod === "express" ? 10 : 0;
    const total = subTotal + deliveryCost - (subTotal * discount) / 100;

    // Création d'une commande temporaire dans la base de données
    const order = await prisma.order.create({
      data: {
        contactEmail,
        contactPhone,
        shippingAddress: address,
        promoCodeId: promoCode || null,
        statut: "pending",
        paymentStatus: "pending",
        orderNumber: Math.floor(Math.random() * 1000000).toString(), // Generate a random order number
        quantity: items.reduce(
          (total: number, item: any) => total + item.quantity,
          0
        ),
        price: total,
        Variant: {
          connect: items.map((item: any) => ({ id: item.id })),
        },
        items: {
          create: items.map((item: any) => ({
            variantId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Création d'une session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${req.headers.get(
        "origin"
      )}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      metadata: {
        orderId: order.id,
      },
    });

    // Retournez l'URL de paiement Stripe
    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("Erreur lors de la validation de la commande :", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
};
