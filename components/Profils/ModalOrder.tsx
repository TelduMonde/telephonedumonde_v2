/* eslint-disable react-hooks/rules-of-hooks */
import { OrderProps } from "@/types";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderProps;
}

export default function ModalOrder({ isOpen, onClose, order }: ModalProps) {
  if (!isOpen) return null;

  if (!order) {
    return null;
  }

  const modalRef = useRef<HTMLDivElement>(null);

  console.log(order);

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
          C° {order.orderNumber}
        </h3>

        {/* INFOS COMMANDE */}
        <div className="flex flex-col gap-2 sm:grid grid-cols-3 items-center justify-center text-white font-font1 text-sm">
          <p className="text-center">
            Date : {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="text-center">Statut : {order.statut}</p>
          <p className="text-center">Total : {order.price} €</p>
        </div>

        {/* LES PRODUITS COMMANDEES */}
        <div className="bg-noir-800 text-white font-font1 p-4 rounded-md text-center">
          <p className="mb-2">LES ARTICLES</p>
          <div className="w-full h-[0.2px] bg-white mb-4 rounded-full" />
          {order.items && order.items.length > 0 ? (
            order.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-3 gap-2 items-center"
              >
                <Image
                  src={item.Variant.images[0]}
                  alt={item.Variant.model.name}
                  width={100}
                  height={100}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex flex-col">
                  <p>
                    <span className="text-xs text-white/70">
                      {item.quantity} x
                    </span>{" "}
                    {item.Variant.model.name}
                  </p>
                </div>
                <p>{item.price} €</p>
              </div>
            ))
          ) : (
            <p>Aucun article dans la commande</p>
          )}
        </div>

        {/* ADRESSES DE LIVRAISON */}
        <div className="flex flex-col sm:flex-row gap-10 text-white font-font1 text-xs">
          <div className="flex flex-col gap-2 bg-noir-800 p-4 rounded-md w-full">
            <p className="uppercase text-lg">Infos & Adresse de Livraison</p>
            <div className="w-full h-[0.2px] bg-white mb-4 rounded-full" />
            <div className="grid grid-cols-2 gap-10">
              <div className="flex justify-center flex-col gap-2">
                {order.PersonnalInfos ? (
                  <>
                    <p>Nom : {order.PersonnalInfos.lastName}</p>
                    <p>Prénom : {order.PersonnalInfos.firstName}</p>
                    <p>Email : {order.contactEmail}</p>
                    <p>N° de tel : {order.contactPhone || "Non renseigné"} </p>
                  </>
                ) : (
                  <p>Informations personnelles non disponibles</p>
                )}
              </div>

              <div className="flex justify-center flex-col gap-2">
                {order.shippingAddress ? (
                  <>
                    <p>Rue : {order.shippingAddress.street}</p>
                    <p>
                      Ville : {order.shippingAddress.postalCode},{" "}
                      {order.shippingAddress.city}
                    </p>
                    <p>Pays : {order.shippingAddress.country}</p>
                    <p>
                      Infos Supplémentaires : {order.shippingAddress.typeAdress}
                    </p>
                  </>
                ) : (
                  <p>Adresse de livraison non disponible</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
