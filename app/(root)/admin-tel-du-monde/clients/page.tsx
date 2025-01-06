"use client";
import ModalOrderUser from "@/components/Admin/Clients/ModalOrderUser";
import { getAllUsersWithOrders } from "@/lib/actions/user.actions";
import { UserPropsAdmin } from "@/types";
import { useSearchParams } from "next/navigation";
import { Search } from "@/components/Admin/Phones/Search";
import React, { useEffect, useState } from "react";
import { Pagination } from "@/components/shared/Pagination";
import DeleteUserModal from "@/components/Admin/Clients/DeleteUserModal";

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [users, setUsers] = useState<UserPropsAdmin[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserPropsAdmin | undefined>(
    undefined
  );

  const handleOpenModal = (user: UserPropsAdmin) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(undefined);
    setIsModalOpen(false);
  };

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const searchText = searchParams.get("query") || "";
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    const fetchUsers = async () => {
      try {
        const data = await getAllUsersWithOrders({
          query: searchText,
          page,
          limit: 10,
        });

        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // const formattedData = data.map((user: any) => ({
          //   ...user,
          //   createdAt: new Date(user.createdAt).toISOString(),
          //   updatedAt: new Date(user.updatedAt).toISOString(),
          //   emailVerified: user.emailVerified
          //     ? new Date(user.emailVerified).toISOString()
          //     : null,
          // }));

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedData = data.data.map((user: any) => ({
            ...user,
            createdAt: new Date(user.createdAt).toISOString(),
            updatedAt: new Date(user.updatedAt).toISOString(),
            emailVerified: user.emailVerified
              ? new Date(user.emailVerified).toISOString()
              : null,
          }));
          setUsers(formattedData);
          setTotalPages(data.totalPages);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch order
    fetchUsers();
  }, [searchText, page]);

  console.log("USERS", users);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="wrapper flex flex-col gap-8">
      {" "}
      <div>
        <h2 className="font-font1 text-white">
          Tous les clients{" "}
          <span className="text-xs text-white/70">(compte client)</span> (
          {users?.length})
        </h2>
      </div>
      <div className="flex gap-2">
        <Search />
      </div>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p className="bg-noir-800 p-4 rounded-md text-white font-font1 flex-center">
            Chargement...
          </p>
        ) : users && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="grid lg:grid-cols-6 gap-2 items-center p-2 font-font1 rounded-md bg-noir-700 text-white"
            >
              <p className="text-center font-bold underline">
                {user.firstName} {user.lastName}
              </p>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              <p>{user.email}</p>
              <p className="text-center">
                <span className="text-xs text-white/70">Nb de Commandes :</span>{" "}
                {user._count.Order}
              </p>
              <button
                onClick={() => handleOpenModal(user)}
                className="bg-gradient-to-t px-2 relative group/btn from-primary-900 to-primary-500 block w-full font-font1 uppercase text-white rounded-md h-7 font-medium text-xs"
              >
                Voir les commandes
              </button>
              <div className="text-center">
                <DeleteUserModal userId={user.id} />
              </div>
            </div>
          ))
        ) : (
          <p className="bg-noir-800 p-4 rounded-md text-white font-font1 flex-center">
            Aucun client trouvé.
          </p>
        )}
      </div>
      {selectedUser && (
        <ModalOrderUser
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
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
