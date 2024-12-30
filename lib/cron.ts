import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function initializeServerTasks() {
  // Planifiez une tâche quotidienne à minuit
  cron.schedule("0 0 * * *", async () => {
    console.log("Vérification quotidienne des codes promo expirés...");

    const now = new Date();

    try {
      // Désactiver les codes promo expirés
      const updatedPromoCodes = await prisma.promoCode.updateMany({
        where: {
          expiresAt: {
            lte: now,
          },
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      console.log(`${updatedPromoCodes.count} codes promo désactivés.`);
    } catch (error) {
      console.error(
        "Erreur lors de la désactivation des codes promo expirés :",
        error
      );
    }
  });
}
