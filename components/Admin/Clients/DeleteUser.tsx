"use client";
import { deleteUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteUserProps {
  setIsModalOpen: (isOpen: boolean) => void;
  userId: string;
}

export default function DeleteUser({
  setIsModalOpen,
  userId,
}: DeleteUserProps) {
  const router = useRouter();

  const deleteUserBtn = async () => {
    try {
      // const response = await fetch(`/api/models/${userId}`, {
      //   method: "DELETE",
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   console.error("Error deleting model:", errorData);
      //   throw new Error("Failed to delete model");
      // }

      await deleteUser({ userId, path: "/admin-tel-du-monde" });

      setIsModalOpen(false);

      router.refresh();

      window.location.href = window.location.href;
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur", error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  return (
    <button
      onClick={deleteUserBtn}
      className="bg-red-600 p-2 rounded-md hover:bg-red-700 transition-all ease-in-out duration-150 text-white"
    >
      Supprimer
    </button>
  );
}
