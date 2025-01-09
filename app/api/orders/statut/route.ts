import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PUT = async (req: NextRequest) => {
  const { orderId, statut } = await req.json();

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { statut },
      include: {
        items: {
          include: {
            Variant: {
              include: {
                model: true,
              },
            },
          },
        },
      },
    });

    // Vérifier si le statut est "envoyé"
    if (statut === "shipped") {
      const personnalInfos = updatedOrder.PersonnalInfos as {
        firstName: string;
        lastName: string;
      };
      const email = updatedOrder.contactEmail;

      const items = updatedOrder.items;

      // Construire le message HTML de l'email
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
                max-width: 100px;
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
                  <p>Bonjour <strong>${personnalInfos?.firstName} ${
        personnalInfos?.lastName
      }</strong>,</p>
                  <p>Votre commande n°<strong>${
                    updatedOrder.orderNumber
                  }</strong> a été envoyée !</p>
                    <ul>
                     ${items
                       .map(
                         (item) =>
                           `<li>
                        <strong>${item.Variant.model.name}</strong> - ${item.price} €
                        <br />
                        <img src="${item.Variant.images[0]}" alt="${item.Variant.model.name}" class="product-image" />
                      </li>`
                       )
                       .join("")}
                    </ul>
                  <p>Merci pour votre confiance. Nous espérons que vous apprécierez votre achat.</p>
                </div>
                <div class="footer">
                  © 2025 Téléphones du Monde - Tous droits réservés
                </div>
              </div>
            </body>
            </html>
          `;

      // Envoyer l'email de notification à l'utilisateur
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
          recipient: {
            name: `${personnalInfos?.firstName} ${personnalInfos?.lastName}`,
            address: email,
          },
          subject: `Votre commande n°${updatedOrder.orderNumber} a été envoyée | Téléphones du Monde`,
          message: htmlMessage,
        }),
      });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
};
