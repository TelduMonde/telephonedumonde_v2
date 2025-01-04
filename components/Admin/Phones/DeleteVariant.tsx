// import { deleteModel } from "@/lib/actions/model.actions";
// import { deleteVariant } from "@/lib/actions/variant.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteVariantButtonProps {
  setIsModalOpen: (isOpen: boolean) => void;
  userId: string | undefined;
  modelSlug: string;
  variantId: string;
}

export default function DeleteVariant({
  setIsModalOpen,
  variantId,
  modelSlug,
}: DeleteVariantButtonProps) {
  const router = useRouter();

  const deleteVariant = async () => {
    try {
      const response = await fetch(`/api/variants/${modelSlug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ variantId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Erreur lors de la suppression du smartphone");
        console.error("Error deleting variant:", errorData);
        throw new Error("Failed to delete variant");
      }

      setIsModalOpen(false);
      toast.success("Smartphone supprimé avec succès");
      router.refresh();
      window.location.href = window.location.href;
    } catch (error) {
      console.error("Erreur lors de la suppression du smartphone", error);
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
