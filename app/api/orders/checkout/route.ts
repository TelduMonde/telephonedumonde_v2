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
    shippingMethodId,
    totalPrice,
  } = await req.json();

  try {
    // Validation des champs obligatoires
    if (
      !contactEmail ||
      !address ||
      !firstName ||
      !lastName ||
      !items ||
      !totalPrice ||
      !shippingMethodId
    ) {
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

    //! Validation du code promo (si fourni)
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

      discount = code.discount ?? 0;
    }

    //! Calcul des coûts avec livraison
    const shippingMethod = await prisma.shippingMethod.findUnique({
      where: { id: shippingMethodId },
    });

    //! Création d'une commande temporaire dans la base de données
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
        price: totalPrice,
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

    //! Création d'une session Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Ajouter les frais de livraison comme une ligne séparée
    if (shippingMethod && shippingMethod.cost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Frais de livraison",
          },
          unit_amount: shippingMethod.cost * 100,
        },
        quantity: 1,
      });
    }

    // Ajouter la réduction comme une ligne séparée (montant négatif)
    if (discount > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Réduction",
          },
          unit_amount: -discount * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
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
        shippingRate: shippingMethod ? shippingMethod.name : "N/A",
        promoCode: promoCode ? promoCode.name + promoCode.discount : "N/A",
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
