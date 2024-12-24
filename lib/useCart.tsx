/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";

const CART_COOKIE_NAME = "user_cart";

export const getCart = () => {
  const cart = Cookies.get(CART_COOKIE_NAME);
  if (!cart) return []; // Pas de cookie, retourner un tableau vide
  try {
    const parsedCart = JSON.parse(cart);
    return Array.isArray(parsedCart) ? parsedCart : []; // Vérifier que c'est un tableau
  } catch {
    console.error("Erreur de parsing du panier depuis les cookies.");
    return []; // En cas d'erreur, retourner un tableau vide
  }
};

export const addToCart = (item: any) => {
  const cart = getCart();
  const updatedCart = [...cart, item];
  Cookies.set(CART_COOKIE_NAME, JSON.stringify(updatedCart), { expires: 7 });
  return updatedCart;
};

export const removeFromCart = (itemId: any) => {
  const cart = getCart();
  const updatedCart = cart.filter((item: { id: any }) => item.id !== itemId);
  Cookies.set(CART_COOKIE_NAME, JSON.stringify(updatedCart), { expires: 7 });
  return updatedCart;
};
