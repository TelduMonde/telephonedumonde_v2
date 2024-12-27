"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeletePromoCodeProps {
  setIsModalOpen: (isOpen: boolean) => void;
  promoCodeId: string;
}

export default function DeletePromoCode({
  setIsModalOpen,
  promoCodeId,
}: DeletePromoCodeProps) {
  const router = useRouter();

  const deleteModel = async () => {
    try {
      const response = await fetch(`/api/promo-codes/${promoCodeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting Code promo:", errorData);
        throw new Error("Failed to delete Code promo");
      }

      setIsModalOpen(false);

      router.refresh();

      window.location.href = window.location.href;
      toast.success("Code promo supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du Code promo", error);
      toast.error("Erreur lors de la suppression du Code promo");
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
