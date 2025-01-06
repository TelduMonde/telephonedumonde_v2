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
