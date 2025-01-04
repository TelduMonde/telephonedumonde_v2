"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { userAdressSchema } from "@/lib/validator";
import { addUserAddress, updateUserAddress } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/utils/use-current-user";
import { Address } from "@/types";
import { BottomGradient } from "../ui/BottomGradient";

interface AddressFormProps {
  address: Address;
}

export const AddressForm = ({ address }: AddressFormProps) => {
  // console.log(address);

  const currentUser = useCurrentUser();
  const userId = currentUser ? currentUser.id : "";

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof userAdressSchema>>({
    resolver: zodResolver(userAdressSchema),
    defaultValues: {
      street: address?.street || "",
      city: address?.city || "",
      state: address?.state || "",
      postalCode: address?.postalCode || "",
      country: address?.country || "",
      typeAdress: address?.typeAdress || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof userAdressSchema>) => {
    setError("");

    const updatedValues = { ...values };

    console.log("UPDATED VALUES", updatedValues);

    if (
      values.street ||
      values.city ||
      values.state ||
      values.postalCode ||
      values.country ||
      values.typeAdress
    ) {
      // Etre sûr que street, city, state, postalCode et country ne sont pas undefined
      startTransition(() => {
        if (address.id) {
          updateUserAddress(userId, address.id, updatedValues)
            .then((data) => {
              if ("error" in data) {
                setError(data.error as string);
              } else if ("success" in data) {
                router.refresh();
                toast.success(data.success);
              }
            })
            .catch(() => setError("Une erreur est survenue"));
        } else {
          addUserAddress(userId, updatedValues)
            .then((data) => {
              if ("error" in data) {
                setError(data.error as string);
              } else if ("success" in data) {
                router.refresh();
                toast.success(data.success);
              }
            })
            .catch(() => setError("Une erreur est survenue"));
        }
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 font-font1"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-white/70 text-xs" htmlFor="street">
              Rue
            </label>
            <input
              id="street"
              placeholder="Rue"
              type="text"
              className="p-1 bg-noir-800 border-b text-white"
              {...form.register("street")}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-white/70 text-xs" htmlFor="city">
              Ville
            </label>
            <input
              id="city"
              placeholder="Ville"
              type="text"
              className="p-1 bg-noir-800 border-b text-white"
              {...form.register("city")}
            />
          </div>
        </div>
        {/* <div className="flex flex-col gap-1">
          <label className="text-white/70 text-xs" htmlFor="State">
            State
          </label>
          <input
            id="State"
            placeholder="State"
            type="text"
            className="text-noir-900 p-1 rounded-md placeholder:text-xs"
            {...form.register("state")}
          />
        </div> */}

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-white/70 text-xs" htmlFor="postalCode">
              Code Postal
            </label>
            <input
              id="postalCode"
              placeholder="Code Postal"
              type="text"
              className="p-1 bg-noir-800 border-b text-white"
              {...form.register("postalCode")}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-white/70 text-xs" htmlFor="country">
              Pays
            </label>
            <input
              id="country"
              placeholder="Pays"
              type="text"
              className="p-1 bg-noir-800 border-b text-white"
              {...form.register("country")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-white/70 text-xs" htmlFor="typeAdress">
            Informations supplémentaires (optionnel)
          </label>
          <input
            id="typeAdress"
            placeholder="Appartement, suite, etc."
            type="text"
            className="p-1 bg-noir-800 border-b text-white"
            {...form.register("typeAdress")}
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="bg-gradient-to-t px-2 relative group/btn from-primary-900 to-primary-500 block w-full font-font1 uppercase text-white rounded-md h-10 font-medium"
        >
          {isPending ? "En cours..." : "Mettre à jour"}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
};
