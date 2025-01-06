"use client";
import { useEffect, useState } from "react";
import { OrderProps } from "@/types";
import ModalOrder from "@/components/Profils/ModalOrder";
import classNames from "classnames";

export default function LastOrder() {
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
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders/dashboard`, {
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
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/statut`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, statut: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Mettre à jour le statut de la commande localement
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, statut: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p className="bg-noir-800 p-4 rounded-md text-white font-font1 flex-center">
            Chargement...
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className={classNames(
                "grid lg:grid-cols-6 gap-2 items-center p-2 font-font1 rounded-md border-2 bg-noir-700 text-white",
                {
                  "border-yellow-500": order.statut === "pending",
                  "border-orange-500": order.statut === "processing",
                  "border-blue-500": order.statut === "shipped",
                  "border-green-500": order.statut === "delivered",
                  "border-red-500": order.statut === "cancelled",
                }
              )}
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
              <select
                value={order.statut}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="bg-noir-500 rounded-md p-1 text-center"
              >
                <option value="pending">Traitement</option>
                <option value="processing">En cours de préparation</option>
                <option value="shipped">Envoyée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
              <button
                onClick={() => handleOpenModal(order)}
                className="bg-gradient-to-t px-2 relative group/btn from-primary-900 to-primary-500 block w-full font-font1 uppercase text-white rounded-md h-7 font-medium text-xs"
              >
                Voir
              </button>
            </div>
          ))
        )}
      </div>

      {selectedOrder && (
        <ModalOrder
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
