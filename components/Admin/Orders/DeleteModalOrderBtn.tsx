"use client";
import { useState } from "react";

import ModalAdmin from "@/components/shared/Modals/ModalAdmin";
import DeleteOrder from "./DeleteOrder";

import { MdDeleteOutline } from "react-icons/md";

interface DeleteModalOrderBtnProps {
  orderId: string;
}

const DeleteModalOrderBtn: React.FC<DeleteModalOrderBtnProps> = ({
  orderId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button onClick={handleOpenModal}>
        <MdDeleteOutline size={20} className="text-white hover:text-white/80" />
      </button>
      <ModalAdmin isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-xl font-bold">Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer cette commande ?</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={handleCloseModal}
            className="bg-noir-800 p-2 rounded-md hover:bg-noir-900 transition-all ease-in-out duration-150"
          >
            Annuler
          </button>
          <DeleteOrder setIsModalOpen={setIsModalOpen} orderId={orderId} />
        </div>
      </ModalAdmin>
    </>
  );
};

export default DeleteModalOrderBtn;
