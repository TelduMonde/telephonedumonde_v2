"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteOrderProps {
  setIsModalOpen: (isOpen: boolean) => void;
  orderId: string;
}

export default function DeleteOrder({
  setIsModalOpen,
  orderId,
}: DeleteOrderProps) {
  const router = useRouter();

  const deleteModel = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting model:", errorData);
        throw new Error("Failed to delete model");
      }

      setIsModalOpen(false);

      router.refresh();

      window.location.href = window.location.href;
      toast.success("Modèle supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du modèle", error);
      toast.error("Erreur lors de la suppression du modèle");
    }
  };

  return (
    <button
      onClick={deleteModel}
      className="bg-red-600 p-2 rounded-md hover:bg-red-700 transition-all ease-in-out duration-150 text-white"
    >
      Supprimer
    </button>
  );
}
