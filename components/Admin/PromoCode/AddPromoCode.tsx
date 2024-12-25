"use client";

import ModalAdmin from "@/components/shared/Modals/ModalAdmin";
import { useState } from "react";
import PromoCodeForm from "./PromoCodeForm";

const AddPromoCodeBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-noir-800 p-2 rounded-md hover:bg-noir-700 transition-all ease-in-out duration-150 text-white font-font1"
      >
        Ajouter un code promo
      </button>

      <ModalAdmin isOpen={isModalOpen} onClose={handleCloseModal}>
        <PromoCodeForm type="add" setIsModalOpen={setIsModalOpen} />
      </ModalAdmin>
    </>
  );
};
export default AddPromoCodeBtn;
