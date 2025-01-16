"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { useCart } from "../../Panier/Context/CartContext";

import { useCurrentUser } from "@/lib/utils/use-current-user";
import { checkoutSchema } from "@/lib/validator";
import { getUserAddress } from "@/lib/actions/user.actions";

// import { FormError } from "@/components/shared/Form/FormError";
// import { FormSuccess } from "@/components/shared/Form/FormSucess";

import { toast } from "sonner";
import Image from "next/image";
import { BottomGradient } from "@/components/ui/BottomGradient";
import { ShippingMethod } from "@/types";

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function ItemsOrder() {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(false);

  const [firstName, lastName] = user?.name ? user.name.split(" ") : ["", ""];

  //! ARTICLES DU PANIER
  const { state } = useCart();

  const [totalPrice, setTotalPrice] = useState(
    state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  );
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoShipped, setPromoShipped] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoCodeId, setPromoCodeId] = useState<string | null>(null);

  //! GESTION FORM
  // const [error, setError] = useState<string | undefined>("");
  // const [success, setSuccess] = useState<string | undefined>("");

  // Gestion de l'adresse : si le user en a une, on la met dans les inputs sinon non.
  //! Initialisation des valeurs locales
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      contactEmail: user?.email || "",
      contactPhone: "",
      shippingMethodId: "",
      address: {
        street: "",
        city: "",
        postalCode: "",
        country: "",
        typeAdress: "",
      },
      promoCodeId: "",
    },
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  //! GET LIVRAISON
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const methods = await fetch("/api/orders/shippingMethod"); // Remplacez par votre endpoint réel
        const data = await methods.json();

        // Ajuster le prix de la livraison standard si promoShipped est vrai
        const adjustedMethods = data.map((method: ShippingMethod) => {
          if (method.name === "Livraison Standard" && promoShipped) {
            return { ...method, cost: 0 };
          }
          return method;
        });

        setShippingMethods(adjustedMethods);

        // Définir la valeur par défaut pour le mode de livraison
        if (adjustedMethods.length > 0) {
          setValue("shippingMethodId", adjustedMethods[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch shipping methods:", error);
      }
    };

    fetchShippingMethods();
  }, [setValue, promoShipped]);

  //! GET ADRESSE UTILISATEUR
  useEffect(() => {
    const fetchuserAdress = async () => {
      if (!user) {
        return;
      }

      // Récupération des adresses de l'utilisateur
      try {
        const userAddress = await getUserAddress(user.id);

        // console.log("Adresse de l'utilisateur :", userAddress);

        if (userAddress && userAddress.length > 0) {
          const address = userAddress[0]; // Récupère la première adresse

          // Met à jour les champs dynamiquement
          setValue("address.street", address.street || "");
          setValue("address.city", address.city || "");
          setValue("address.postalCode", address.postalCode || "");
          setValue("address.country", address.country || "");
          setValue("address.typeAdress", address.typeAdress || "");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'adresse :", error);
      }
    };

    fetchuserAdress();
  }, [user, setValue]);

  //! CHANGEMEMENT DU TOTAL EN FONCTION DE LA LIVRAISON
  const shippingMethodId = watch("shippingMethodId");

  useEffect(() => {
    const selectedShippingMethod = shippingMethods.find(
      (method) => method.id === shippingMethodId
    );
    const shippingCost = selectedShippingMethod
      ? promoShipped && selectedShippingMethod.name === "Livraison Standard"
        ? 0
        : selectedShippingMethod.cost
      : 0;
    const itemsTotalPrice = state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalPrice(itemsTotalPrice + shippingCost - discount);
  }, [shippingMethodId, shippingMethods, state.items, promoShipped, discount]);

  //! APPLIQUER LE CODE PROMO
  const applyPromoCode = async () => {
    if (promoCode) {
      try {
        const response = await fetch("/api/orders/validate-promo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: state.items,
            promoCode: promoCode,
            shippingMethodId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.error);
          return;
        }

        const data = await response.json();
        setPromoApplied(true);
        setPromoCodeId(data.promoCodeId);
        setDiscount(data.discount);
        setTotalPrice(data.total);
        setPromoShipped(data.isShippedFree);
        if (data.isShippedFree) {
          toast.success("Vous avez accès à une livraison gratuite !");
        } else {
          toast.success("Code promo appliqué avec succès !");
        }
      } catch (error) {
        console.error("Error applying promo code:", error);
        toast.error("Erreur lors de l'application du code promo.");
      }
    } else {
      setDiscount(0);
      setPromoShipped(false);
    }
  };

  //! SOUMISSION DU FORMULAIRE
  const onSubmit = async (data: CheckoutFormData) => {
    setLoading(true);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone?.trim() || null, // Transformez les chaînes vides en null
        shippingMethodId: data.shippingMethodId,
        items: state.items, // Vérifiez que `state.items` contient des items valides
        totalPrice,
        promoCodeId,
      };

      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la validation.");
      }

      // Redirection vers Stripe
      window.location.href = result.checkoutUrl;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.message);
      toast.error("Erreur lors de la validation de la commande.");
      setLoading(false);
    }
  };

  return (
    <section className="lg:wrapper flex flex-col gap-10">
      <div className="w-full lg:w-2/4 mx-auto flex flex-col gap-4 bg-noir-800 p-2 rounded-md">
        <h2 className="text-lg uppercase text-white font-font1 font-bold tracking-widest bg-gradient-to-t from-primary-900 to-primary-500 p-2 rounded-md text-center">
          Articles
        </h2>
        <ul className="text-white font-font1">
          {state.items.map((item) => (
            <li key={item.id} className="flex justify-between items-center">
              <div className="w-full flex flex-col lg:grid grid-cols-4 gap-2 items-center bg-noir-700 p-2 rounded-md">
                <Image
                  alt={item.name}
                  src={item.image}
                  width={50}
                  height={50}
                  className="mx-auto"
                />
                <p className="text-center">{item.name}</p>
                <p className="text-sm text-center text-gray-500">
                  Quantité : {item.quantity}
                </p>
                <p className="text-center">{item.price * item.quantity} €</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="w-full flex flex-col lg:flex-row justify-between items-center px-5 rounded-md bg-noir-700">
          <div className="flex flex-col lg:flex-row gap-4 items-center p-2">
            <label htmlFor="promoCode" className="text-white font-font1">
              Code promo :
            </label>
            <input
              type="text"
              id="promoCode"
              value={promoCode}
              disabled={promoApplied}
              onChange={(e) => setPromoCode(e.target.value)}
              className="text-xs font-font1 rounded-md px-2 h-8 w-40"
            />
            <button
              type="button"
              onClick={applyPromoCode}
              disabled={promoApplied}
              className="bg-gradient-to-t px-2 relative group/btn from-primary-900 to-primary-500 block text-white rounded-md h-8 w-28 font-medium font-font1"
            >
              Appliquer
              <BottomGradient />
            </button>
          </div>

          {discount > 0 && (
            <p className="text-white">Réduction: -{discount}€</p>
          )}
          <p className="pb-4 pt-2 lg:p-0 font-bold text-white font-font1">
            TOTAL : {totalPrice} €
          </p>
        </div>

        {/* <div className="flex justify-between p-2 rounded-md">
          {discount > 0 && <p>Réduction: -{discount}€</p>}
          <p className="font-bold text-white font-font1">
            Total : {totalPrice} €
          </p>
          <p className="font-bold text-white font-font1">
            Total après réduction: {totalPrice}€
          </p>
        </div> */}
      </div>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="w-full lg:w-2/4 mx-auto bg-noir-800 p-2 rounded-md">
            <h3 className="text-base font-font1 text-white font-semibold mb-2">
              Informations Personnelles
            </h3>
            <div className="space-y-4 font-font1 text-sm">
              <input
                type="text"
                placeholder="Nom"
                {...register("lastName")}
                className="w-full border rounded-md p-2"
              />
              {errors.lastName && (
                <p className="text-red-500">{errors.lastName.message}</p>
              )}

              <input
                type="text"
                placeholder="Prénom"
                {...register("firstName")}
                className="w-full border rounded-md p-2"
              />
              {errors.firstName && (
                <p className="text-red-500">{errors.firstName.message}</p>
              )}
            </div>
          </div>

          <div className="w-full lg:w-2/4 mx-auto bg-noir-800 p-2 rounded-md">
            <h3 className="text-base font-font1 text-white font-semibold mb-2">
              Informations de contact
            </h3>
            <div className="space-y-4 font-font1 text-sm">
              <input
                type="email"
                placeholder="Email"
                {...register("contactEmail")}
                className="w-full border rounded-md p-2"
              />
              {errors.contactEmail && (
                <p className="text-red-500">{errors.contactEmail.message}</p>
              )}

              <input
                type="text"
                placeholder="Téléphone"
                {...register("contactPhone")}
                className="w-full border rounded-md p-2"
              />
              {errors.contactPhone && (
                <p className="text-red-500">{errors.contactPhone.message}</p>
              )}
            </div>
          </div>

          <div className="w-full lg:w-2/4 mx-auto bg-noir-800 p-2 rounded-md">
            <h3 className="text-base font-font1 text-white font-semibold mb-2">
              Adresse de livraison
            </h3>
            <div className="space-y-4 font-font1 text-sm">
              <input
                id="street"
                type="text"
                placeholder="Rue"
                {...register("address.street")}
                // value={defaultAddress.street}
                className="w-full border rounded-md p-2"
              />
              {errors.address?.street && (
                <p className="text-red-500">{errors.address.street.message}</p>
              )}

              <input
                id="city"
                type="text"
                placeholder="Ville"
                {...register("address.city")}
                className="w-full border rounded-md p-2"
              />
              {errors.address?.city && (
                <p className="text-red-500">{errors.address.city.message}</p>
              )}

              <input
                id="postalCode"
                type="text"
                placeholder="Code postal"
                {...register("address.postalCode")}
                className="w-full border rounded-md p-2"
              />
              {errors.address?.postalCode && (
                <p className="text-red-500">
                  {errors.address.postalCode.message}
                </p>
              )}

              <input
                id="typeAdress"
                type="text"
                placeholder="Appartement, suite, etc. (optionnel)"
                {...register("address.typeAdress")}
                className="w-full border rounded-md p-2"
              />
              {errors.address?.typeAdress && (
                <p className="text-red-500">
                  {errors.address.typeAdress.message}
                </p>
              )}

              <input
                id="country"
                type="text"
                placeholder="Pays"
                {...register("address.country")}
                className="w-full border rounded-md p-2"
              />
              {errors.address?.country && (
                <p className="text-red-500">{errors.address.country.message}</p>
              )}
            </div>
          </div>

          <div className="w-full lg:w-2/4 mx-auto bg-noir-800 p-2 rounded-md">
            <h3 className="text-base text-white font-semibold mb-2">
              Mode de livraison
            </h3>
            <select
              id="shippingMethodId"
              {...register("shippingMethodId")}
              className="w-full rounded-md p-2 font-font1 text-sm"
            >
              {shippingMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name} | {method.description} | {method.cost} €
                </option>
              ))}
            </select>
            {errors.shippingMethodId && (
              <p>{errors.shippingMethodId.message}</p>
            )}
          </div>

          <div className="w-full lg:w-2/4 mx-auto flex flex-col gap-4 bg-noir-800 p-2 rounded-md text-center">
            {discount > 0 && (
              <p className="text-white">Réduction: -{discount}€</p>
            )}
            <p className="pb-4 pt-2 lg:p-0 font-bold text-white font-font1">
              <span className="text-white/80 font-normal">
                TOTAL DE LA COMMANDE :
              </span>{" "}
              {totalPrice} €
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full lg:w-2/4 mx-auto bg-gradient-to-t px-2 relative group/btn from-primary-900  to-primary-500 block text-white rounded-md h-10 font-bold font-font1 uppercase tracking-widest"
          >
            {loading ? "CONFIRMATION...." : "Confirmer et payer"}
            <BottomGradient />
          </button>
        </form>
      </FormProvider>
    </section>
  );
}
