"use client";
import { createContext, useContext, useEffect, useReducer } from "react";
import Cookies from "js-cookie";

// Types
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

const CART_COOKIE_NAME = "user_cart";

// Initial state
const initialState: CartState = {
  items: [], // Assurez-vous que c'est bien un tableau vide
};

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};

// Contexts
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    const savedCart = Cookies.get(CART_COOKIE_NAME);
    try {
      const parsed = savedCart ? JSON.parse(savedCart) : initial;
      return Array.isArray(parsed.items) ? parsed : initial;
    } catch {
      return initial; // En cas d'erreur, on retourne l'état initial
    }
  });

  // Sauvegarder dans les cookies chaque fois que le panier change
  useEffect(() => {
    Cookies.set(CART_COOKIE_NAME, JSON.stringify(state), { expires: 3 });
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useCart = () => useContext(CartContext);
