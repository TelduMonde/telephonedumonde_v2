"use client";

import ModalAdmin from "@/components/shared/Modals/ModalAdmin";
import { useState } from "react";
import ShippingMethodForm from "./LivraisonForm";

export const AddLivraisonBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-noir-800 p-2 rounded-md hover:bg-noir-700 transition-all ease-in-out duration-150 text-white font-font1"
      >
        Ajouter une livraison
      </button>

      <ModalAdmin isOpen={isModalOpen} onClose={handleCloseModal}>
        <ShippingMethodForm type="add" setIsModalOpen={setIsModalOpen} />
      </ModalAdmin>
    </>
  );
};
