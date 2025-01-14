import { currentRole } from "@/lib/auth";
import { db } from "../db";

export async function getTotalRevenu() {
  try {
    const role = await currentRole();
    if (role !== "admin") {
      console.error("Error fetching users:", "Vous n'êtes pas autorisé.");
      return null;
    }

    const orders = await db.order.findMany({
      where: {
        paymentStatus: "paid", // Filtrer les commandes avec le statut "paid"
      },
      select: {
        price: true,
      },
    });

    if (!orders) {
      return 0;
    }

    const totalRevenue = orders.reduce(
      (total, order) => total + order.price,
      0
    );

    return totalRevenue;
  } catch {
    return null;
  }
}

export async function getOrdersPaid() {
  try {
    const role = await currentRole();
    if (role !== "admin") {
      console.error("Error fetching users:", "Vous n'êtes pas autorisé.");
      return null;
    }

    const orders = await db.order.findMany({
      where: {
        paymentStatus: "paid", // Filtrer les commandes avec le statut "paid"
      },
    });

    return orders.length;
  } catch {
    return null;
  }
}

export async function getNumberSaleItems() {
  try {
    const role = await currentRole();
    if (role !== "admin") {
      console.error("Error fetching users:", "Vous n'êtes pas autorisé.");
      return null;
    }

    const orders = await db.order.findMany({
      where: {
        paymentStatus: "paid", // Filtrer les commandes avec le statut "paid"
      },
      select: {
        items: true,
      },
    });

    if (!orders) {
      return 0;
    }

    const totalItems = orders.reduce(
      (total, order) => total + order.items.length,
      0
    );

    return totalItems;
  } catch {
    return null;
  }
}
