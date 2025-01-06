/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@/lib/auth";

// import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const user = await currentUser();

  const {
    firstName,
    lastName,
    items,
    contactEmail,
    contactPhone,
    address,
    promoCode,
    deliveryMethod,
  } = await req.json();

  try {
    // Validation des champs obligatoires
    if (!contactEmail || !address || !firstName || !lastName) {
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
        userId: user?.id || null,
        contactEmail,
        contactPhone: contactPhone || "",
        shippingAddress: address,
        PersonnalInfos: {
          firstName,
          lastName,
        },
        promoCodeId: promoCode || null,
        statut: "pending",
        paymentStatus: "pending",
        orderNumber: Math.floor(Math.random() * 1000000).toString(), // Generate a random order number
        quantity: items.reduce(
          (total: number, item: any) => total + item.quantity,
          0
        ),
        price: total,
        items: {
          create: items.map((item: any) => ({
            variantId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    if (!order || !order.id) {
      throw new Error("La commande n'a pas été correctement créée.");
    }

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
      shipping_options: [
        {
          shipping_rate: "shr_1QdyjsIVAQDvDHAw240L3DVR", // Livraison standard
        },
        {
          shipping_rate: "shr_1QdyklIVAQDvDHAweEZBgS7Q", // Livraison express
        },
      ],
      mode: "payment",
      billing_address_collection: "required",
      success_url: `${req.headers.get(
        "origin"
      )}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${
        order.orderNumber
      }&orderId=${order.id}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        shippingRate: deliveryCost,
      },
    });

    // Retournez l'URL de paiement Stripe
    return NextResponse.json({ checkoutUrl: session.url });
    // return NextResponse.json({ order }); // Pour le moment sinon cest la ligne au dessus
  } catch (err) {
    console.error("Erreur lors de la validation de la commande :", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
};

// {
//   shipping_rate_data: {
//     display_name: "Standard",
//     delivery_estimate: {
//       minimum: { unit: "business_day", value: 7 },
//       maximum: { unit: "business_day", value: 10 },
//     },
//     fixed_amount: {
//       amount: 1000, // 5€ en centimes
//       currency: "eur",
//     },
//   },
// },
// {
//   shipping_rate_data: {
//     display_name: "Express",
//     delivery_estimate: {
//       minimum: { unit: "business_day", value: 3 },
//       maximum: { unit: "business_day", value: 5 },
//     },
//     fixed_amount: {
//       amount: 1500, // 15€ en centimes
//       currency: "eur",
//     },
//   },
// },
