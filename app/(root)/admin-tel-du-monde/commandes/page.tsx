"use client";
import { useEffect, useState } from "react";
import { OrderProps } from "@/types";
import ModalOrder from "@/components/Profils/ModalOrder";
import classNames from "classnames";
import { useSearchParams } from "next/navigation";
import FilterStatut from "@/components/Admin/Orders/FilterStatut";
import { Pagination } from "@/components/shared/Pagination";
import FilterDate from "@/components/Admin/Orders/FilterDate";
import DeleteModalOrderBtn from "@/components/Admin/Orders/DeleteModalOrderBtn";

export default function OrdersPage() {
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
  const [totalPages, setTotalPages] = useState();

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [orderBy, setOrderBy] = useState<string>("desc");
  const statut = searchParams.get("statut") || "";
  const dateRange = searchParams.get("dateRange") || "";

  useEffect(() => {
    setIsLoading(true);
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `/api/orders?statut=${statut}&dateRange=${dateRange}&orderBy=${orderBy}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching models:", errorData);
          throw new Error("Failed to fetch models");
        }

        const data = await response.json();
        console.log("Fetched orders:", data); // Log the fetched orders
        setOrders(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch order
    fetchOrders();
  }, [statut, dateRange, orderBy]);

  console.log(orders);
  console.log(totalPages);

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
    <div className="wrapper flex flex-col gap-8">
      <div>
        <h2 className="font-font1 text-white">
          Toutes les commandes ({orders.length})
        </h2>
      </div>

      <div className="flex gap-2">
        <FilterStatut />
        <FilterDate />
        <select
          onChange={(event) => setOrderBy(event.target.value)}
          className="p-1 px-4 rounded-md bg-noir-900 text-xs text-white border border-white/70"
        >
          <option value="desc">Date de création: décroissant</option>
          <option value="asc">Date de création: croissant</option>
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p className="bg-noir-800 p-4 rounded-md text-white font-font1 flex-center">
            Chargement...
          </p>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className={classNames(
                "grid md:grid-cols-7 gap-2 items-center p-2 font-font1 rounded-md border-2 bg-noir-700 text-white",
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
              <p className="text-xs">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="text-xs text-white/70">
                  x {order.quantity}{" "}
                </span>
                {order.items[0].Variant.model.name}
              </p>
              <p>{order.price} €</p>
              <div className="text-center">
                <select
                  value={order.statut}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="bg-noir-500 rounded-md p-1 text-center text-xs"
                >
                  <option value="pending">Traitement</option>
                  <option value="processing">En cours de préparation</option>
                  <option value="shipped">Envoyée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
              <div className="text-center">
                <button
                  onClick={() => handleOpenModal(order)}
                  className="bg-gradient-to-t px-2 relative group/btn from-primary-900 to-primary-500 block w-full font-font1 uppercase text-white rounded-md h-7 font-medium text-xs"
                >
                  Voir
                </button>
              </div>
              <div className="text-center">
                <DeleteModalOrderBtn orderId={order.id} />
              </div>
            </div>
          ))
        ) : (
          <p className="bg-noir-800 p-4 rounded-md text-white font-font1 flex-center">
            Aucune commande trouvée.
          </p>
        )}
      </div>

      {selectedOrder && (
        <ModalOrder
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          order={selectedOrder}
        />
      )}

      {totalPages && totalPages > 1 && (
        <div className="bg-gradient-to-l from-noir-800 to-noir-900 flex justify-end p-1 rounded-md">
          <div className="">
            <Pagination page={page} totalPages={totalPages} />
          </div>
        </div>
      )}
    </div>
  );
}
