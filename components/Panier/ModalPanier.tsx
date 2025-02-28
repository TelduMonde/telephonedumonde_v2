import { useCallback, useEffect, useRef, useState } from "react";

import { MdOutlineShoppingCart } from "react-icons/md";
import { BottomGradient } from "../ui/BottomGradient";
import { useCart } from "./Context/CartContext";
import Image from "next/image";

import { MdDeleteOutline } from "react-icons/md";

type ItemProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: ItemProps[];
  onRemove: (itemId: string) => void;
}

const ModalPanier: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  //! Gestion de la modal
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

  //! Gestion du panier
  const { state, dispatch } = useCart();

  const totalPrice = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  //! PASSER AU PAIEMENT
  // const [promoCode, setPromoCode] = useState(""); // État pour le code promo
  const [loading, setLoading] = useState(false); // État pour l'indicateur de chargement
  const [error, setError] = useState<string | null>(null);

  const handleValidation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders/validation-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items,
          promoCode: null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Une erreur est survenue");
      }

      // Si la validation réussit, redirigez l'utilisateur vers la page de pré-checkout
      console.log("Validation réussie", result);
      onClose();
      window.location.href = "/checkout"; // Remplacez par la route de votre choix
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-end z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div
        ref={modalRef}
        className="backdrop-blur-md w-1/4 h-full shadow-lg relative flex justify-center items-center"
      >
        <MdOutlineShoppingCart
          size={30}
          className="absolute top-7 left-10 text-white text-2xl  rounded-full"
        />
        <button
          onClick={onClose}
          className="absolute top-7 right-10 text-white text-2xl"
        >
          &times;
        </button>

        <div className="w-full px-8 flex flex-col gap-6">
          {state.items.length === 0 ? (
            <p className="font-font1 uppercase font-bold text-center block rounded-md text-whit">
              Votre panier est vide.
            </p>
          ) : (
            <>
              <ul className="flex flex-col gap-6">
                {state.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 justify-between items-center text-xs"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="item-image"
                    />
                    <div className="flex flex-col gap-1">
                      <p>{item.name}</p>
                      <p className="font-bold">{item.price} €</p>
                    </div>
                    <p>
                      Quantité :{" "}
                      <span className="font-bold">{item.quantity}</span>
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-button"
                    >
                      <MdDeleteOutline
                        size={20}
                        className="text-white hover:text-white/80"
                      />
                    </button>
                  </li>
                ))}
              </ul>
              {/* <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Entrez votre code promo"
                  className="w-full rounded-md text-noir-900 text-sm p-1"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              </div> */}

              {/* Erreur */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Bouton de validation */}
              <div className="flex items-center justify-around font-font1 bg-noir-800 p-2 rounded-md text-white">
                <p className="font-bold text-lg"> {totalPrice} €</p>
              </div>
              <button
                onClick={handleValidation}
                disabled={loading}
                className="bg-gradient-to-t px-2 relative group/btn font-font1 from-primary-900  to-primary-500 block w-full text-white rounded-md h-10 font-medium"
              >
                {loading ? "Validation en cours..." : "Passer au paiement"}
                <BottomGradient />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalPanier;
