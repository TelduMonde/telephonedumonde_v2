"use client";
import ModalConnexion from "@/components/Auth/ModalConnexion";
import ModalPanier from "@/components/Panier/ModalPanier";
import { getCart, removeFromCart } from "@/lib/useCart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MdOutlineAccountCircle, MdOutlineShoppingCart } from "react-icons/md";
import { Search } from "../SearchModel";
import { useCart } from "@/components/Panier/Context/CartContext";

interface NavItemsProps {
  onLinkClick?: () => void;
  session: { user: { name: string; email: string; role: string } } | null;
}

export const NavItemsBis = ({ onLinkClick, session }: NavItemsProps) => {
  const pathname = usePathname();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPanierOpen, setIsPanierOpen] = useState(false);

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  const handleAccountClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      setIsModalOpen(true);
    } else {
      handleLinkClick();
    }
  };

  const isActive = pathname === "/mon-compte";

  //! GESTION DU PANIER
  const [cart, setCart] = useState(() => getCart());
  const { state } = useCart();

  // Calcul du nombre total d'articles
  const totalItemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const removeFromCartHandler = (itemId: string) => {
    const updatedCart = removeFromCart(itemId);
    setCart(updatedCart);
  };

  return (
    <>
      <ul className="flex gap-6 items-center">
        <li className="relative flex">
          <Search />
        </li>
        <li>
          <Link
            href={session ? "/mon-compte" : "#"}
            onClick={handleAccountClick}
          >
            <MdOutlineAccountCircle
              size={25}
              className={`${
                isActive
                  ? "bg-gradient-to-t from-primary-500 to-second-500 rounded-full"
                  : "hover:text-white/70"
              }`}
            />
          </Link>
        </li>
        <li>
          <div
            className="relative flex items-center gap-4"
            onClick={() => setIsPanierOpen(true)}
          >
            <MdOutlineShoppingCart
              size={25}
              className="cursor-pointer hover:text-white/70"
            />
            {totalItemCount > 0 && (
              <span className="cursor-pointer absolute -top-2 -right-2 bg-gradient-to-t from-primary-500 to-primary-900 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItemCount}
              </span>
            )}
          </div>
        </li>
      </ul>

      <ModalConnexion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ModalPanier
        isOpen={isPanierOpen}
        onClose={() => setIsPanierOpen(false)}
        cartItems={cart}
        onRemove={removeFromCartHandler}
      />
    </>
  );
};
