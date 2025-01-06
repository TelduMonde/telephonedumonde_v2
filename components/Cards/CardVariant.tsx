"use client";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import { useCart } from "../Panier/Context/CartContext";
import { BottomGradient } from "../ui/BottomGradient";
import { toggleFavoriteVariant } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { VariantFav } from "@/types";

export default function CardVariant({
  variant,
  userId,
}: {
  variant: VariantFav;
  userId: string;
}) {
  const router = useRouter();

  //! Ajouter au panier
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    if (variant) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: variant.id,
          name: variant.model.name,
          price: variant.price,
          quantity: 1,
          image: variant.images[0],
        },
      });
    }
    toast.success("Produit ajouté au panier !");
  };

  //! retirer des fav
  //! Ajouter ou retirer la variante sélectionnée des favoris
  const handleToggleFavorite = async () => {
    if (!userId) {
      console.error("Vous devez être connecté pour ajouter aux favoris.");
      return;
    }
    if (variant) {
      const variantId = variant.id;
      console.log("Ajout/Retrait des favoris...", userId, variantId);
      try {
        await toggleFavoriteVariant({ userId, variantId });
        toast.success("Smartphone retiré aux favoris !");
        router.refresh();
      } catch {
        toast.error("Erreur lors de l'ajout aux favoris.");
      }
    } else {
      console.error(
        "Veuillez sélectionner toutes les options avant de gérer les favoris."
      );
    }
  };

  return (
    <div>
      <div className="relative group w-full min-w-[300px] lg:min-h-[350px] pt-4 hover:shadow-2xl transition-all ease-in-out duration-300 rounded-md">
        {/* DRAPEAU */}
        {/* <div className="absolute top-0 right-0 w-8 h-8 rounded-md group-hover:w-full group-hover:h-10 transition-all ease-in-out duration-300">
        <Image
          src="/Carrousel/flagcanada.webp"
          height={1000}
          width={1000}
          alt="iPhone 14 Pro"
          className="rounded-md object-cover h-full"
        />
      </div> */}

        {/* IMAGE TEL */}
        <div className="w-full h-[200px] z-20 flex flex-center flex-col overflow-hidden">
          <Image
            src={variant.images[0]}
            height={200}
            width={200}
            alt={variant.model.name}
            className="object-contain w-full h-full transition-transform ease-in-out duration-300 group-hover:scale-110"
          />
        </div>

        {/* INFOS */}
        <div className="bg-gradient-to-b from-noir-900 to-noir-800 h-[150px] lg:h-[170px] -mt-10 rounded-md transition-all ease-in-out duration-300 z-10">
          <div className="px-3 lg:px-0 lg:wrapper flex flex-col gap-4 justify-center">
            <div className="pt-12 flex justify-between items-center">
              <p className="text-xs text-noir-100 text-center">
                {variant.model.brand.toString()}
              </p>
              <h3 className="text-white font-font1 text-base lg:text-lg sm:text-center">
                {variant.model.name}{" "}
              </h3>
              <p className="text-white font-font1"> {variant.price} €</p>
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-white to-transparent" />
            <div className="grid grid-cols-3 gap-1">
              <p className="text-center text-white font-font1 text-xs">
                {variant.memory} Go
              </p>
              <p className="text-center text-white font-font1 text-xs">
                {variant.color}
              </p>
              <p className=" text-center text-white font-font1 text-xs">
                {variant.country?.name}
              </p>
            </div>
            {/* <p className="hidden lg:block text-white font-font1 font-bold text-base lg:text-xl text-center">
              {variant.price} €
            </p> */}
          </div>
        </div>
        <div className="w-full mt-2 flex flex-row gap-1">
          <button
            onClick={handleAddToCart}
            className="font-font1 text-sm lg:text-lg uppercase bg-gradient-to-t px-2 relative group/btn from-primary-900 to-primary-500 block w-full text-white rounded-md h-10 font-medium  "
          >
            Ajouter au panier
            <BottomGradient />
          </button>
          <button
            onClick={handleToggleFavorite}
            className="text-white font-fontb text-xs hover:text-white/70 bg-noir-700 rounded-md"
          >
            Retirer des favoris
          </button>
        </div>
      </div>
    </div>
  );
}
