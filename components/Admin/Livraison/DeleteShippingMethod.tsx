import { deleteDelivery } from "@/lib/actions/delivery.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteShippingMethodProps {
  setIsModalOpen: (isOpen: boolean) => void;
  shippingMethodId: string;
}

export default function DeleteShippingMethod({
  setIsModalOpen,
  shippingMethodId,
}: DeleteShippingMethodProps) {
  const router = useRouter();

  const deleteShippingMethod = async () => {
    try {
      await deleteDelivery(shippingMethodId);
      setIsModalOpen(false);
      router.refresh();
      toast.success("Méthode de livraison supprimée avec succès");
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la méthode de livraison",
        error
      );
      toast.error("Erreur lors de la suppression de la méthode de livraison");
    }
  };
  return (
    <button
      onClick={deleteShippingMethod}
      className="bg-red-600 p-2 rounded-md hover:bg-red-700 transition-all ease-in-out duration-150 text-white"
    >
      Supprimer
    </button>
  );
}
