"use server";
import * as z from "zod";
import { db } from "../db";
import { createDeliverySchema } from "../validator";
import { currentRole } from "../auth";

export const createDelivery = async (
  values: z.infer<typeof createDeliverySchema>
) => {
  const userRole = await currentRole();

  if (userRole !== "admin") {
    return {
      error:
        "Vous n'avez pas les droits nécessaires pour effectuer cette action.",
    };
  }

  const { name, cost, description } = values;

  const delivery = await db.shippingMethod.create({
    data: {
      name,
      cost,
      description,
    },
  });

  return {
    success: "La méthode de livraison a été créée avec succès.",
    delivery,
  };
};

export const updateDelivery = async (
  id: string,
  values: z.infer<typeof createDeliverySchema>
) => {
  const userRole = await currentRole();

  if (userRole !== "admin") {
    return {
      error:
        "Vous n'avez pas les droits nécessaires pour effectuer cette action.",
    };
  }

  const { name, cost, description } = values;

  const delivery = await db.shippingMethod.update({
    where: { id },
    data: {
      name,
      cost,
      description,
    },
  });

  return {
    success: "La méthode de livraison a été modifié avec succès.",
    delivery,
  };
};

export const deleteDelivery = async (id: string) => {
  const userRole = await currentRole();

  if (userRole !== "admin") {
    return {
      error:
        "Vous n'avez pas les droits nécessaires pour effectuer cette action.",
    };
  }

  const delivery = await db.shippingMethod.delete({
    where: { id },
  });

  return {
    success: "La méthode de livraison a été supprimée avec succès.",
    delivery,
  };
};

export const getDeliveries = async () => {
  const deliveries = await db.shippingMethod.findMany();

  return deliveries;
};
