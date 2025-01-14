"use client";
import { useState } from "react";

import ModalAdmin from "@/components/shared/Modals/ModalAdmin";

import { FaEdit } from "react-icons/fa";
import { ShippingMethod } from "@/types";
import ShippingMethodForm from "./LivraisonForm";

interface EditPromoCodeBtnProps {
  shippingMethod: ShippingMethod;
  shippingMethodId: string;
}

export default function EditShippingMethodBtn({
  shippingMethod,
  shippingMethodId,
}: EditPromoCodeBtnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button onClick={handleOpenModal}>
        <FaEdit size={20} className="text-white hover:text-white/80" />
      </button>

      <ModalAdmin isOpen={isModalOpen} onClose={handleCloseModal}>
        <ShippingMethodForm
          type="edit"
          shippingMethod={shippingMethod}
          shippingMethodId={shippingMethodId}
          setIsModalOpen={setIsModalOpen}
        />
      </ModalAdmin>
    </>
  );
}
