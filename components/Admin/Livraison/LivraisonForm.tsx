"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { createDelivery, updateDelivery } from "@/lib/actions/delivery.actions";
import { createDeliverySchema } from "@/lib/validator";

import { FormError } from "@/components/shared/Form/FormError";
import { FormSuccess } from "@/components/shared/Form/FormSucess";
import { toast } from "sonner";

import { BottomGradient } from "@/components/ui/BottomGradient";

type ShippingMethodFormProps = {
  type: "add" | "edit";
  setIsModalOpen: (isOpen: boolean) => void;
  shippingMethod?: {
    name: string;
    cost: number;
    description: string | null;
  };
  shippingMethodId?: string;
};

export default function ShippingMethodForm({
  type,
  shippingMethod,
  shippingMethodId,
  setIsModalOpen,
}: ShippingMethodFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const initialValues =
    type === "edit"
      ? {
          name: shippingMethod?.name || "",
          cost: shippingMethod?.cost || 1,
          description: shippingMethod?.description || "",
        }
      : {
          name: "",
          cost: 0,
          description: "",
        };

  const form = useForm({
    resolver: zodResolver(createDeliverySchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  async function onSubmit(values: z.infer<typeof createDeliverySchema>) {
    setError("");
    setSuccess("");

    if (type === "add") {
      try {
        startTransition(() => {
          createDelivery(values).then(
            (data: { error?: string; success?: string }) => {
              setError(data.error);
              setSuccess(data.success);
              toast.success(data.success);
              form.reset();
              router.refresh();
              setIsModalOpen(false);
            }
          );
        });
      } catch (error) {
        console.log(error);
        setError("Erreur lors de l'ajout du mode de livraison");
        toast.error("Erreur lors de l'ajout du mode de livraison");
      }
    }

    if (type === "edit") {
      try {
        if (!shippingMethodId) {
          setError("Erreur lors de la modification du mode de livraison");
          return;
        }

        startTransition(() => {
          updateDelivery(shippingMethodId, values).then(
            (data: { error?: string; success?: string }) => {
              setError(data.error);
              setSuccess(data.success);
              toast.success(data.success);
              router.refresh();
              setIsModalOpen(false);
            }
          );
        });
      } catch (error) {
        console.log(error);
        setError("Erreur lors de la modification du mode de livraison");
        toast.error("Erreur lors de la modification du mode de livraison");
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-white text-xl font-font1 tracking-widest font-bold">
        {type === "add" ? "Ajouter un code promo" : "Modifier un code promo"}
      </h3>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {" "}
        <div className="flex gap-2">
          <div className="w-full flex flex-col gap-1">
            <label className="text-white text-sm" htmlFor="name">
              Mode de livraison
            </label>
            <input
              id="name"
              placeholder="Livraison Standard"
              type="text"
              className="text-noir-900 p-1 rounded-md placeholder:text-xs"
              {...form.register("name")}
            />
          </div>

          <div className="w-full flex flex-col gap-1">
            <label className="text-white text-sm" htmlFor="cost">
              Prix de la livraison
            </label>
            <input
              id="cost"
              placeholder="10"
              type="number"
              className="text-noir-900 p-1 rounded-md placeholder:text-xs"
              {...form.register("cost", { valueAsNumber: true })}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-full flex flex-col gap-1">
            <label className="text-white text-sm" htmlFor="description">
              Pourcentage à appliquer
            </label>
            <input
              id="description"
              placeholder="7 à 10 jours ouvrés"
              type="text"
              className="text-noir-900 p-1 rounded-md"
              {...form.register("description")}
            />
          </div>
        </div>
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
        <button
          id="submit"
          type="submit"
          disabled={isPending}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          {type === "add"
            ? "Créer un mode de livraison"
            : "Modifier le mode de livraison"}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}
