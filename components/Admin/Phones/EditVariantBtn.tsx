"use client";
import { useState } from "react";

import ModalAdmin from "@/components/shared/Modals/ModalAdmin";
import VariantForm from "./VariantForm";
import { FaEdit } from "react-icons/fa";

type EditVariantButtonProps = {
  userId: string;
  modelId?: string;
  modelSlug?: string;
  variantID?: string;
  variant?: {
    model: { name: string };
    id: string;
    price: number;
    memory: number;
    color: string;
    country: string;
    countryId: string;
    description: string;
    stock: number;
    imageUrl: string[];
    isActive: boolean;
    modelId: string;
  };
};

const EditVariantBtn: React.FC<EditVariantButtonProps> = ({
  userId,
  variantID,
  variant,
  modelSlug,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button onClick={handleOpenModal}>
        <FaEdit size={15} className="text-white hover:text-white/80" />
      </button>

      <ModalAdmin isOpen={isModalOpen} onClose={handleCloseModal}>
        <VariantForm
          userId={userId}
          variantID={variantID}
          modelSlug={modelSlug}
          type="edit"
          variant={variant} // Passez la variante ici
          setIsModalOpen={setIsModalOpen}
        />
      </ModalAdmin>
    </>
  );
};

export default EditVariantBtn;
