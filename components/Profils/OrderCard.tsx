"use client";
import { useEffect, useState } from "react";
import ModalOrder from "./ModalOrder";
import { Transition } from "../shared/Transition";
import { useCurrentUser } from "@/lib/utils/use-current-user";
import { OrderProps } from "@/types";

export default function OrderCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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

  console.log("ORDERS", orders);

  return (
    <Transition>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p className="bg-noir-800 p-4 rounded-md text-white font-font1 flex-center">
            Chargement...
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="grid lg:grid-cols-6 gap-2 items-center bg-noir-800 text-white p-2 font-font1 rounded-md"
            >
              <p className="text-center font-bold underline">
                C° {order.orderNumber}
              </p>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              <p>
                <span className="text-xs text-white/70">
                  x {order.quantity}{" "}
                </span>
                {order.items[0].Variant.model.name}
              </p>
              <p>{order.price} €</p>
              <p>Statut : {order.statut}</p>
              <button
                onClick={handleOpenModal}
                className="bg-noir-500 rounded-md p-1"
              >
                Voir
              </button>
              <ModalOrder
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                order={order}
              />
            </div>
          ))
        )}
      </div>
    </Transition>
  );
}
