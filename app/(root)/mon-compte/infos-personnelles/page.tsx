"use client";

import { AddressForm } from "@/components/Profils/AdressForm";
import { UpdateUserForm } from "@/components/Profils/UpdateUserForm";
import { Transition } from "@/components/shared/Transition";
import { deleteUser, getUserByIdForProfile } from "@/lib/actions/user.actions";
import { useCurrentUser } from "@/lib/utils/use-current-user";
import { Address } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Mes Informations Personnelles | Téléphones du Monde",
//   description:
//     "Gérez vos informations personnelles sur Téléphones du Monde. Mettez à jour vos coordonnées, vos préférences, et sécurisez votre compte en toute simplicité.",
//   keywords: [
//     "informations personnelles",
//     "gestion compte",
//     "modifier profil",
//     "mise à jour coordonnées",
//     "sécurité compte",
//     "téléphones internationaux",
//     "téléphones pas chers",
//     "préférences utilisateur",
//   ],
// };

interface User {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  image?: string | null;
  role: string;
  addresses: Address[];
}

export default function InfosPersonnelleProfils() {
  const router = useRouter();
  const userId = useCurrentUser()?.id;
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("Utilisateur non trouvé.");
        return;
      }
      try {
        const userData = await getUserByIdForProfile(userId);
        setUser(userData);
      } catch (err) {
        setError("Impossible de charger les données utilisateur.");
        console.error(err);
      }
    };

    fetchUserData();
  }, [userId]);

  //! SUPPRESSION DU COMPTE
  const handleDeleteAccount = async () => {
    try {
      await deleteUser({ userId: userId!, path: "/" });
      toast.success("Votre compte a été supprimé avec succès.");
      router.push("/");
    } catch (err) {
      toast.error(
        "Une erreur s'est produite lors de la suppression de votre compte."
      );
      console.error(err);
    }
  };

  return (
    <Transition>
      <div className="wrapper text-white flex-center flex-col gap-2">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {user ? (
          <>
            <div className="wrapper flex flex-col justify-start items-start gap-10 lg:w-2/4 ">
              <div className="w-full bg-noir-800 p-6 rounded-md">
                <UpdateUserForm user={user} />
              </div>

              <div className="w-full bg-noir-800 p-6 rounded-md">
                <AddressForm address={user.addresses[0]} />
              </div>
            </div>

            <button
              onClick={toggleModal}
              className="text-xs font-font1 hover:text-white/80"
            >
              Supprimer mon compte
            </button>
            <div className="flex justify-end w-full">
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="flex flex-col gap-4 bg-noir-100 p-6 rounded-md shadow-md relative w-1/3">
                    <button
                      onClick={toggleModal}
                      className="absolute top-4 right-5 text-white text-2xl"
                    >
                      &times;
                    </button>
                    <p className="font-font1 text-white text-sm uppercase">
                      êtes-vous sûr de vouloir supprimer définitivement votre
                      compte ?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={toggleModal}
                        className="bg-noir-600 p-2 rounded-md hover:bg-red-700 transition-all ease-in-out duration-150 text-white"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 p-2 rounded-md hover:bg-red-700 transition-all ease-in-out duration-150 text-white"
                      >
                        Supprimer mon compte
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-white bg-noir-800 p-6 rounded-md font-font1 font-bold text-sm">
            Chargement des informations...
          </p>
        )}
      </div>
    </Transition>
  );
}
