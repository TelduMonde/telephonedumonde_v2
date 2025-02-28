"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteModelProps {
  setIsModalOpen: (isOpen: boolean) => void;
  modelId: string;
}

export default function DeleteModel({
  setIsModalOpen,
  modelId,
}: DeleteModelProps) {
  const router = useRouter();

  const deleteModel = async () => {
    try {
      const response = await fetch(`/api/models/${modelId}`, {
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
