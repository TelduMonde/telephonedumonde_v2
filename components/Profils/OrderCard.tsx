/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";
import ModalOrder from "./ModalOrder";
import { Transition } from "../shared/Transition";
import { useCurrentUser } from "@/lib/utils/use-current-user";
import { OrderProps } from "@/types";
import { BottomGradient } from "../ui/BottomGradient";

export default function OrderCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(null);

  const handleOpenModal = (order: OrderProps) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [orders, setOrders] = useState<OrderProps[]>([]);

  const user = useCurrentUser();
  const userId = user?.id;

  useEffect(() => {
    setIsLoading(true);
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders/profile?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching models:", errorData);
          throw new Error("Failed to fetch models");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch order
    fetchOrders();
  }, [userId]);

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
    <Transition>
      <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-col gap-4">
        {isLoading ? (
          <p className="bg-noir-800 p-4 rounded-md text-white font-font1 flex-center">
            Chargement...
          </p>
        ) : orders.length === 0 ? (
          <p className="bg-noir-800 p-4 rounded-md uppercase text-white font-font1 flex-center">
            Vous n'avez pas encore passé de commande.
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="w-full sm:w-1/3 lg:w-full flex flex-col gap-4  lg:grid lg:grid-cols-6 lg:gap-2 items-center bg-noir-700 text-white p-2 font-font1 rounded-md"
            >
              <p className="text-center font-bold text-lg">
                C° {order.orderNumber}
              </p>
              <p className="text-sm sm:text-base">
                Date : {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm sm:text-base">
                <span className="text-xs text-white/70">
                  x {order.quantity}{" "}
                </span>
                {order.items[0].Variant.model.name}
              </p>
              <p className="text-sm sm:text-base">{order.price} €</p>
              <p className="text-sm sm:text-base">
                Statut :{" "}
                <span className="font-bold text-lg">
                  {getStatusText(order.statut)}
                </span>
              </p>
              <button
                onClick={() => handleOpenModal(order)}
                className="bg-gradient-to-t px-2 relative group/btn from-primary-900  to-primary-500 block w-full text-white rounded-md h-8 font-medium font-font1 uppercase tracking-widest"
              >
                Voir
                <BottomGradient />
              </button>
            </div>
          ))
        )}
        {selectedOrder && (
          <ModalOrder
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            order={selectedOrder}
          />
        )}
      </div>
    </Transition>
  );
}
