/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalOrder({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="flex flex-col gap-4 bg-noir-500 p-6 rounded-md shadow-md relative w-4/5 lg:w-2/4"
      >
        <button
          onClick={onClose}
          className="absolute top-7 right-10 text-white text-2xl"
        >
          &times;
        </button>

        {/* NUMERO DE COMMANDE */}
        <h3 className="bg-noir-800 rounded-md p-2 text-white font-font1 text-center">
          C° 17876933
        </h3>

        {/* INFOS COMMANDE */}
        <div className="flex flex-col gap-2 sm:grid grid-cols-3 items-center justify-center text-white font-font1 text-sm">
          <p className="text-center">Date : 08/12/2024</p>
          <p className="text-center">Statut : En Cours</p>
          <p className="text-center">Total : 987,00 €</p>
        </div>

        {/* LES PRODUITS COMMANDEES */}
        <div className="bg-noir-800 text-white font-font1 p-2 rounded-md text-center">
          LES ARTICLES
        </div>

        {/* ADRESSES DE LIVRAISON */}
        <div className="flex flex-col sm:flex-row gap-10 text-white font-font1 text-xs">
          <div className="flex flex-col gap-2">
            <p className="uppercase">Adresse de Livraison</p>
            <p>5 rue Auguste Bernard</p>
            <p>78320, La Verrière</p>
          </div>
          <div className="hidden sm:flex h-[65px] w-[1px] bg-white" />
          <div className="flex flex-col gap-2">
            <p className="uppercase">Adresse de facturation</p>
            <p>5 rue Auguste Bernard</p>
            <p>78320, La Verrière</p>
          </div>
          <div className="hidden sm:flex h-[65px] w-[1px] bg-white" />
        </div>
      </div>
    </div>
  );
}
