/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { OrderProps, UserPropsAdmin } from "@/types";
import Image from "next/image";
import React, { useCallback, useEffect, useRef } from "react";
// import { UserProps } from '@/types';

interface ModalOrderUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserPropsAdmin | null;
}

export default function ModalOrderUser({
  isOpen,
  onClose,
  user,
}: ModalOrderUserProps) {
  //! Gestion modal
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  if (!user) {
    return null;
  }

  console.log("USER MODALE", user.Order);

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

  //! Fonction pour afficher le statut de la commande
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Traitement";
      case "processing":
        return "En cours de préparation";
      case "shipped":
        return "Envoyée";
      case "delivered":
        return "Livrée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="flex flex-col gap-4 bg-noir-500 p-6 rounded-md shadow-md relative w-4/5 lg:w-2/5 max-h-[25rem] lg:max-h-[30rem] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-7 right-10 text-white text-2xl"
        >
          &times;
        </button>

        <h3 className="bg-noir-800 rounded-md p-2 text-white font-font1 text-center">
          Commandes de {user.firstName} {user.lastName}
        </h3>

        <div className="flex flex-col gap-4">
          {user.Order && user.Order.length > 0 ? (
            user.Order.map((order: OrderProps) => (
              <div key={order.id} className="bg-noir-700 p-4 rounded-md">
                <p className="text-white font-font1">
                  <strong>Numéro de commande :</strong> {order.orderNumber}
                </p>
                <p className="text-white font-font1">
                  <strong>Date :</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-white font-font1">
                  <strong>Statut :</strong> {getStatusText(order.statut)}
                </p>
                <p className="text-white font-font1">
                  <strong>Total :</strong> {order.price} €
                </p>

                <div className="bg-noir-800 text-white font-font1 p-4 rounded-md text-center mt-4">
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
              </div>
            ))
          ) : (
            <p className="text-white font-font1">Aucune commande trouvée.</p>
          )}
        </div>
      </div>
    </div>
  );
}
