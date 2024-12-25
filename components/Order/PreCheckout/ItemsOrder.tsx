"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { useCart } from "../../Panier/Context/CartContext";

import { useCurrentUser } from "@/lib/utils/use-current-user";

// import { FormError } from "@/components/shared/Form/FormError";
// import { FormSuccess } from "@/components/shared/Form/FormSucess";

// import { BottomGradient } from "@/components/ui/BottomGradient";
// import { toast } from "sonner";
import { checkoutSchema } from "@/lib/validator";
import { getUserAddress } from "@/lib/actions/user.actions";

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function ItemsOrder() {
  const user = useCurrentUser();

  console.log("USER CHECKOUT", user);

  //! ARTICLES DU PANIER
  const { state } = useCart();

  const totalPrice = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  //! GESTION FORM
  // const [error, setError] = useState<string | undefined>("");
  // const [success, setSuccess] = useState<string | undefined>("");

  // Gestion de l'adresse : si le user en a une, on la met dans les inputs sinon non.
  const [defaultAddress, setDefaultAddress] = useState<
    CheckoutFormData["address"]
  >({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const fetchuserAdress = async () => {
      if (!user) {
        return;
      }

      // Récupération des adresses de l'utilisateur
      const userAddress = await getUserAddress(user.id);

      console.log("USER ADDRESS", userAddress);

      // Si l'utilisateur a une adresse, on la set comme adresse par défaut
      if (userAddress && userAddress.length > 0) {
        setDefaultAddress({
          street: userAddress[0].street,
          city: userAddress[0].city,
          postalCode: userAddress[0].postalCode,
          country: userAddress[0].country,
        });
      }
    };

    fetchuserAdress();
  }, [user]);

  // Initialiser les valeurs par défaut du formulaire
  const initialValues: CheckoutFormData = {
    contactEmail: user?.email || "",
    contactPhone: "",
    address: defaultAddress,
    promoCode: "",
    deliveryMethod: "standard",
  };

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    register,
    // setValue,
    formState: { errors },
  } = form;

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items,
          ...data,
        }),
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
    }
  };

  return (
    <>
      <div>
        <ul className="text-white">
          {state.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <p>{item.name}</p>
                <p className="text-sm text-gray-500">
                  Quantité : {item.quantity}
                </p>
              </div>
              <p>{item.price * item.quantity} €</p>
            </li>
          ))}
        </ul>
        <p className="font-bold text-white">Total : {totalPrice} €</p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-base text-white font-semibold mb-2">
            Informations de contact
          </h3>
          <div className="space-y-4">
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

          <h3 className="text-base text-white font-semibold mb-2">
            Adresse de livraison
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Rue"
              {...register("address.street")}
              className="w-full border rounded-md p-2"
            />
            {errors.address?.street && (
              <p className="text-red-500">{errors.address.street.message}</p>
            )}

            <input
              type="text"
              placeholder="Ville"
              {...register("address.city")}
              className="w-full border rounded-md p-2"
            />
            {errors.address?.city && (
              <p className="text-red-500">{errors.address.city.message}</p>
            )}

            <input
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
              type="text"
              placeholder="Pays"
              {...register("address.country")}
              className="w-full border rounded-md p-2"
            />
            {errors.address?.country && (
              <p className="text-red-500">{errors.address.country.message}</p>
            )}
          </div>

          <h3 className="text-base text-white font-semibold mb-2">
            Mode de livraison
          </h3>
          <select
            {...register("deliveryMethod")}
            className="w-full border rounded-md p-2"
          >
            <option value="standard">Standard (5 €)</option>
            <option value="express">Express (10 €)</option>
          </select>
          {errors.deliveryMethod && (
            <p className="text-red-500">{errors.deliveryMethod.message}</p>
          )}

          <h3 className="text-base text-white font-semibold mb-2">
            Code promo
          </h3>
          <input
            type="text"
            placeholder="Code promo"
            {...register("promoCode")}
            className="w-full border rounded-md p-2"
          />

          <button
            type="submit"
            className="bg-gradient-to-t px-2 relative group/btn from-primary-900  to-primary-500 block w-full text-white rounded-md h-10 font-medium "
          >
            Confirmer et payer
          </button>
        </form>
      </FormProvider>
    </>
  );
}
