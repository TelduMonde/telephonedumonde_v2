"use server";
import * as z from "zod";

import { db } from "../db";
import { userProfileSchema, userSettingSchema } from "../validator";

import { currentRole } from "@/lib/auth";

import { revalidatePath } from "next/cache";
import { Address } from "@/types";
import { generateVerificationToken } from "../token";

//! GET USER BY ID ----- PRISMA MODE
export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  } catch {
    return null;
  }
}

//! GET USER BY EMAIL ----- PRISMA MODE
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    return user;
  } catch {
    return null;
  }
};

//! TOUS LES USERS
export async function getAllUsersWithOrders({
  page,
  query,
  limit,
}: {
  page: number;
  query: string;
  limit: number;
}) {
  try {
    const role = await currentRole();
    if (role !== "admin") {
      console.error("Error fetching users:", "Vous n'êtes pas autorisé.");
      return null;
    }

    const skipAmount = (Number(page) - 1) * limit;

    const users = await db.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        _count: {
          select: { Order: true },
        },
        Order: {
          include: {
            items: {
              include: {
                Variant: {
                  select: {
                    images: true,
                    model: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      skip: skipAmount,
      take: limit,
    });

    const totalUsers = await db.user.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    // Map users to include the number of orders
    const usersWithOrderCount = users.map((user) => ({
      ...user,
      orderCount: user._count.Order,
    }));

    return {
      data: usersWithOrderCount,
      totalPages: Math.ceil(totalUsers / limit),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}

//! GET USER BY ID POUR LE PROFIL
export async function getUserByIdForProfile(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,

        role: true,

        addresses: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            typeAdress: true,
          },
        },
      },
    });
    return user;
  } catch {
    return null;
  }
}

//! UPDATE USER FOR PROFILE
export async function updateProfileUser(
  values: z.infer<typeof userProfileSchema>
) {
  // Importation de currentUser ici : éviter les conflits d'importation qui génere une erreur
  const { currentUser } = await import("../auth");
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "User not found" };
  }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "User not found" };
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Profil mis à jour !" };
}

export async function addUserAddress(userId: string, addressData: Address) {
  try {
    await db.address.create({
      data: {
        userId,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country,
        typeAdress: addressData.typeAdress,
      },
    });

    await db.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });

    revalidatePath(`/mon-compte/infos-personnelles`);
    return { success: "Profil mis à jour !" };
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'adresse:", error);
    throw new Error("Impossible d'ajouter l'adresse.");
  }
}

export async function updateUserAddress(
  userId: string,
  addressId: string,
  addressData: Address
) {
  try {
    await db.address.update({
      where: { id: addressId },
      data: {
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country,
        typeAdress: addressData.typeAdress,
      },
    });

    revalidatePath(`/mon-compte/infos-personnelles`);
    return { success: "Profil mis à jour !" };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'adresse:", error);
    throw new Error("Impossible de mettre à jour l'adresse.");
  }
}

export async function getUserAddress(userId: string) {
  try {
    if (!userId) {
      return null;
    }
    return await db.address.findMany({
      where: { userId },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des adresses:", error);
    throw new Error("Impossible de récupérer les adresses.");
  }
}

//! UPDATE USER FOR SETTINGS
export async function updateSettingUser(
  values: z.infer<typeof userSettingSchema>
) {
  const { currentUser } = await import("../auth");
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "User not found" };
  }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "User not found" };
  }

  // Le user est connecté avec Google ou pas ? On ne peut pas changer son adresse mail ni avoir une authentification à deux facteurs : on les met à undefined pour que leur valeur ne change pas quoi qu'il arrive.
  if (user.isOAuth) {
    values.email = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser) {
      return { error: "Email déjà utilisé" };
    }

    //   // Envoyer un email de vérification
    const verificationToken = await generateVerificationToken(values.email);
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
        recipient: { name: user.name, address: verificationToken.email },
        subject: "Vérifiez votre adresse email",
        message: `Cliquez sur le lien suivant pour vérifier votre adresse email : ${process.env.BASE_URL}/auth/new-verification?token=${verificationToken.token}`,
      }),
    });

    return {
      success:
        "Un email de vérification a été envoyé à votre adresse mail. Veuillez vérifier votre boîte de réception.",
    };
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Paramètres mis à jour !" };
}

//! DELETE USER
export const deleteUser = async ({
  userId,
  path,
}: {
  userId: string;
  path: string;
}) => {
  try {
    const deletedUser = await db.user.delete({
      where: { id: userId },
    });

    if (deletedUser) revalidatePath(path);
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    throw new Error("Impossible de supprimer l'utilisateur.");
  }
};

//! AJOUTER UNE VARIANTE EN FAVORI
export async function toggleFavoriteVariant({
  userId,
  variantId,
}: {
  userId: string;
  variantId: string;
}) {
  try {
    // Vérifier si la variante est déjà dans les favoris de l'utilisateur
    const existingFavorite = await db.userWishlist.findUnique({
      where: {
        userId_variantId: {
          userId,
          variantId,
        },
      },
    });

    if (existingFavorite) {
      // Si la variante est déjà dans les favoris, la retirer
      await db.userWishlist.delete({
        where: {
          userId_variantId: {
            userId,
            variantId,
          },
        },
      });
      console.log("Variante retirée des favoris");
    } else {
      // Sinon, ajouter la variante aux favoris
      await db.userWishlist.create({
        data: {
          userId,
          variantId,
        },
      });
      console.log("Variante ajoutée aux favoris");
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris:", error);
    throw new Error("Impossible d'ajouter aux favoris.");
  }
}

//! Get les favoris de l'utilisateur
export async function getFavoriteVariants({ userId }: { userId: string }) {
  try {
    const favoriteVariants = await db.userWishlist.findMany({
      where: { userId },
      include: {
        Variant: {
          include: {
            model: true,
            country: true,
          },
        },
      },
    });

    return favoriteVariants;
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    throw new Error("Impossible de récupérer les favoris.");
  }
}

//! AJOUTER AUX FAVORIS
// export async function addFavoriteEvent({
//   userId,
//   eventId,
// }: {
//   userId: string;
//   eventId: string;
// }) {
//   try {
//     const user = await db.user.findUnique({
//       where: { id: userId },
//       include: { wishlist: true },
//     });
//     if (!user) throw new Error("User not found");

//     // Véririfier si l'événement est déjà dans la wishlist de l'utilisateur
//     const isLiked = await db.userWishlist.findFirst({
//       where: {
//         userId: userId,
//         eventId: eventId,
//       },
//     });

//     console.log("isLiked", isLiked);

//     const event = await db.event.findUnique({
//       where: { id: eventId },
//       select: { nbFav: true },
//     });

//     // event.nbFav = Number(event.nbFav) || 0;

//     if (isLiked) {
//       // Si l'event est déja dans les FAV, on le retire et on décrémente le nbFav
//       await db.userWishlist.delete({
//         where: {
//           userId_eventId: {
//             userId: userId,
//             eventId: eventId,
//           },
//         },
//       });

//       if (event && event.nbFav > 0) {
//         await db.event.update({
//           where: { id: eventId },
//           data: {
//             nbFav: {
//               decrement: 1,
//             },
//           },
//         });
//       }
//     } else {
//       // Si l'event n'est pas dans les FAV, on l'ajoute dans la wishlist et on incrémente le nbFav
//       await db.userWishlist.create({
//         data: {
//           userId: userId,
//           eventId: eventId,
//         },
//       });
//       await db.event.update({
//         where: { id: eventId },
//         data: {
//           nbFav: {
//             increment: 1,
//           },
//         },
//       });
//     }

//     // Récupérer l'événement mis à jour pour obtenir le nbFav mis à jour
//     const updatedEvent = await db.event.findUnique({
//       where: { id: eventId },
//       select: { nbFav: true }, // Sélectionner uniquement le nbFav si c'est tout ce dont vous avez besoin
//     });

//     // Return the updated user and the updated nbFav of the event
//     return {
//       nbFav: updatedEvent?.nbFav, // Ajouter le nbFav mis à jour à l'objet retourné
//     };
//   } catch (error: string | any) {
//     console.log(error);
//     throw new Error(`Erreur lors de l'ajout aux favoris : ${error.message}`);
//   }
// }

//! GET LA WISHLIST
// export async function getWishlist({
//   userId,
//   page = 1,
// }: {
//   userId: string;
//   page: number;
// }) {
//   try {
//     const skipAmount = (Number(page) - 1) * 6;

//     const userWithWishlist = await db.user.findUnique({
//       where: { id: userId },
//       select: {
//         wishlist: {
//           orderBy: {
//             createdAt: "desc", // Trier par createdAt en ordre décroissant
//           },
//           take: 6,
//           skip: skipAmount,
//         },
//       },
//     });

//     if (!userWithWishlist) throw new Error("User not found");

//     return userWithWishlist.wishlist;
//   } catch (error) {
//     console.log(error);
//   }
// }
