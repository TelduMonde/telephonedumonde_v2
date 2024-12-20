"use client";
import { useState } from "react";

import ModalAdmin from "@/components/shared/Modals/ModalAdmin";
import ModelForm from "@/components/Admin/Phones/ModelForm";

const AddModelButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-noir-800 p-2 rounded-md hover:bg-noir-700 transition-all ease-in-out duration-150 text-white font-font1"
      >
        Ajouter un modèle
      </button>

      <ModalAdmin isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModelForm type="add" setIsModalOpen={setIsModalOpen} />
      </ModalAdmin>
    </>
  );
};

export default AddModelButton;
