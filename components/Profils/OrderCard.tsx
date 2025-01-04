"use client";
import { useState } from "react";
import ModalOrder from "./ModalOrder";
import { Transition } from "../shared/Transition";

export default function OrderCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Transition>
      <div>
        <div className="grid lg:grid-cols-6 gap-2 items-center bg-noir-800 text-white p-2 font-font1 rounded-md">
          <p className="text-center font-bold underline">C° 018972</p>
          <p>Date</p>
          <p>Quantité</p>
          <p>Prix</p>
          <p>Statut : En cours</p>
          <button
            onClick={handleOpenModal}
            className="bg-noir-500 rounded-md p-1"
          >
            Voir
          </button>
        </div>
      </div>

      <ModalOrder isOpen={isModalOpen} onClose={handleCloseModal} />
    </Transition>
  );
}
