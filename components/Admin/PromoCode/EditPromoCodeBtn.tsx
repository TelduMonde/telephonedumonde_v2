"use client";
import { useState } from "react";

import ModalAdmin from "@/components/shared/Modals/ModalAdmin";

import { FaEdit } from "react-icons/fa";
import PromoCodeForm from "./PromoCodeForm";
import { PromoCode } from "@/types";

interface EditPromoCodeBtnProps {
  promoCode: PromoCode;
  promoCodeId: string;
}

const EditPromoCodeBtn: React.FC<EditPromoCodeBtnProps> = ({
  promoCode,
  promoCodeId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button onClick={handleOpenModal}>
        <FaEdit size={20} className="text-white hover:text-white/80" />
      </button>

      <ModalAdmin isOpen={isModalOpen} onClose={handleCloseModal}>
        <PromoCodeForm
          type="edit"
          promoCode={promoCode}
          promoCodeId={promoCodeId}
          setIsModalOpen={setIsModalOpen}
        />
      </ModalAdmin>
    </>
  );
};

export default EditPromoCodeBtn;
