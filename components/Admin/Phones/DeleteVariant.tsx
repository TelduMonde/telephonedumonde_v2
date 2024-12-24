// import { deleteModel } from "@/lib/actions/model.actions";
// import { deleteVariant } from "@/lib/actions/variant.actions";
import { useRouter } from "next/navigation";

interface DeleteVariantButtonProps {
  setIsModalOpen: (isOpen: boolean) => void;
  userId: string | undefined;
  modelId: string;
  variantId: string;
}

export default function DeleteVariant({
  setIsModalOpen,
  variantId,
}: DeleteVariantButtonProps) {
  const router = useRouter();

  const deleteVariant = async () => {
    try {
      const response = await fetch(`/api/variants/${variantId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting variant:", errorData);
        throw new Error("Failed to delete variant");
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la suppression du variant", error);
    }
  };

  return (
    <button
      onClick={deleteVariant}
      className="bg-red-600 p-2 rounded-md hover:bg-red-700 transition-all ease-in-out duration-150 text-white"
    >
      Supprimer
    </button>
  );
}
