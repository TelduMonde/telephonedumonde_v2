"use server";
import * as z from "zod";
import { db } from "../db";
import { NextResponse } from "next/server";

import { currentRole } from "../auth";
import { variantFormSchema } from "../validator";

// Afficher les variantes d'un model
export const showVariantsByModel = async (modelId: string) => {
  try {
    const variants = await db.phoneVariant.findMany({
      where: {
        modelId,
      },
      include: {
        model: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            url: true,
          },
        },
        country: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return variants.map((variant) => ({
      ...variant,
      imageUrl: variant.images.length > 0 ? variant.images[0].url : null,
    }));
  } catch (error) {
    console.log(error);
    throw new Error("Echec lors de la récupération des variantes.");
  }
};

// Ajouter une variante du model
export const addVariant = async (
  variante: z.infer<typeof variantFormSchema>,
  userId: string,
  modelId: string
) => {
  try {
    const result = variantFormSchema.safeParse(variante);

    if (!result.success) {
      console.error("Données invalides :", result.error.errors);
      throw new Error("Les données de la variante sont invalides.");
    }

    console.log("Données validées :", variante);
  } catch (error) {
    console.error("Erreur lors de la validation des données :", error);
    throw new Error("Les données de la variante sont invalides.");
  }

  const role = await currentRole();
  if (role !== "admin") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Créer la variante
    const newVariant = await db.phoneVariant.create({
      data: {
        modelId,
        price: variante.price,
        memory: variante.memory,
        color: variante.color,
        description: variante.description,
        stock: variante.stock ?? 0,
        isActive: variante.isActive,
        countryId: variante.country ?? "",
      },
    });

    if (!modelId) {
      throw new Error("modelId est requis pour créer une variante.");
    }

    // Associer le pays
    if (variante.country) {
      await db.phoneVariant.update({
        where: { id: newVariant.id },
        data: {
          country: { connect: { id: variante.country } },
        },
      });
    }

    // Associer les images
    if (variante.imageUrl && variante.imageUrl.length > 0) {
      await db.phoneImage.createMany({
        data: variante.imageUrl.map((url) => ({
          url,
          description: null,
          variantId: newVariant.id,
        })),
      });
    }

    console.log("Variante créée avec succès :", newVariant);
    return newVariant;
    // return new NextResponse(JSON.stringify(newVariant), { status: 201 });
  } catch (error) {
    console.error("Erreur dans addVariant :", error);
    return new NextResponse(
      JSON.stringify({ error: "Echec lors de la création de la variante." }),
      { status: 500 }
    );
  }
};

// Modifier une variante
export const updateVariant = async (
  variantId: string,
  variante: z.infer<typeof variantFormSchema>,
  imagesToDelete: string[]
) => {
  console.log("VARIANTE EDIT", variante);
  const role = await currentRole();
  if (role !== "admin") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  try {
    const result = variantFormSchema.safeParse(variante);

    if (!result.success) {
      console.error("Données invalides :", result.error.errors);
      throw new Error("Les données de la variante sont invalides.");
    }

    console.log("Données validées :", variante, imagesToDelete);
  } catch (error) {
    console.error("Erreur lors de la validation des données :", error);
    throw new Error("Les données de la variante sont invalides.");
  }

  try {
    const countryExists = await db.country.findUnique({
      where: { id: variante.country },
    });

    if (!countryExists) {
      throw new Error("Le pays spécifié n'existe pas.");
    }

    const updatedVariant = await db.phoneVariant.update({
      where: { id: variantId },
      data: {
        price: variante.price,
        memory: variante.memory,
        color: variante.color,
        description: variante.description,
        stock: variante.stock ?? 0,
        isActive: variante.isActive,
      },
    });

    // Associer le pays
    if (variante.country) {
      await db.phoneVariant.update({
        where: { id: updatedVariant.id },
        data: {
          country: { connect: { id: variante.country } },
        },
      });
    }

    // Supprimer les images marquées pour suppression
    if (imagesToDelete && imagesToDelete.length > 0) {
      await db.phoneImage.deleteMany({
        where: {
          url: { in: imagesToDelete },
        },
      });
    }

    // Associer les images
    if (variante.imageUrl && variante.imageUrl.length > 0) {
      await db.phoneImage.createMany({
        data: variante.imageUrl.map((url) => ({
          url,
          description: null,
          variantId: updatedVariant.id,
        })),
      });
    }

    console.log("Variante modifiée avec succès :", variantId);
    return updateVariant;
  } catch (error) {
    console.error("Erreur dans updateVariant :", error);
    return new NextResponse(
      JSON.stringify({ error: "Echec lors de la mise à jour de la variante." }),
      { status: 500 }
    );
  }
};

//! Supprimer une variante
export const deleteVariant = async (variantId: string) => {
  const role = await currentRole();
  if (role !== "admin") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  try {
    await db.phoneVariant.delete({
      where: {
        id: variantId,
      },
    });
  } catch (error) {
    console.error("Erreur dans deleteVariant :", error);
    return new NextResponse(
      JSON.stringify({ error: "Echec lors de la mise à jour de la variante." }),
      { status: 500 }
    );
  }
};

//! Supprimer une image d'une variante
export const deleteImage = async (image: string[]) => {
  console.log("imageId :", image);
  const role = await currentRole();
  if (role !== "admin") {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  try {
    await db.phoneImage.deleteMany({
      where: {
        url: { in: image },
      },
    });
  } catch (error) {
    console.error("Erreur dans deleteImage :", error);
    return new NextResponse(
      JSON.stringify({ error: "Echec lors de la suppression de l'image." }),
      { status: 500 }
    );
  }
};
