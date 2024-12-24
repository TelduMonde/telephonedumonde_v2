"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { FormError } from "@/components/shared/Form/FormError";
import { FormSuccess } from "@/components/shared/Form/FormSucess";

import { BottomGradient } from "@/components/ui/BottomGradient";
import { modelFormSchema } from "@/lib/validator";
import { useCurrentUser } from "@/lib/utils/use-current-user";
import { toast } from "sonner";

type PhoneFormProps = {
  type: "add" | "edit";
  modelId?: string;
  model?: {
    id: string;
    brand: string;
    name: string;
    isActive: boolean;
  };
  setIsModalOpen: (isOpen: boolean) => void;
};

export default function ModelForm({
  type,
  modelId,
  model,
  setIsModalOpen,
}: PhoneFormProps) {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const user = useCurrentUser();
  const userId = user?.id;

  console.log("USER", user);

  const initialValues =
    model && type === "edit"
      ? {
          brand: model?.brand,
          name: model?.name,
          isActive: model?.isActive,
        }
      : {
          brand: "",
          name: "",
          isActive: true,
        };

  //! Schema de validation
  const form = useForm<z.infer<typeof modelFormSchema>>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  //! Fonction de soumission du formulaire
  async function onSubmit(values: z.infer<typeof modelFormSchema>) {
    setError("");
    setSuccess("");

    if (type === "add") {
      try {
        if (!userId) {
          setError("Connectez-vous pour ajouter un modèle");
          return;
        }

        const response = await fetch("/api/models", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand: values.brand,
            name: values.name,
            isActive: values.isActive,
            userId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add model");
        }

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        form.reset();
        setSuccess("Modèle ajouté avec succès");
        setIsModalOpen(false);
        router.refresh();
        window.location.href = window.location.href;
        toast.success("Modèle ajouté avec succès");
      } catch (error) {
        console.log(error);
        setError("Erreur lors de l'ajout du modèle");
        toast.error("Erreur lors de l'ajout du modèle");
      }
    }

    if (type === "edit") {
      if (!modelId) {
        setError("Erreur lors de la récupération du modèle");
        return;
      }

      console.log(values);

      try {
        const response = await fetch(`/api/models/${modelId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand: values.brand,
            name: values.name,
            isActive: values.isActive,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to edit model");
        }

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        form.reset();
        setSuccess("Modèle modifié avec succès");
        setIsModalOpen(false);
        router.refresh();
        window.location.href = window.location.href;
        toast.success("Modèle modifié avec succès");
      } catch (error) {
        console.log(error);
        setError("Erreur lors de la modification du modèle");
        toast.error("Erreur lors de la modification du modèle");
      }
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-white text-xl font-font1 tracking-widest">
        {type === "add" ? "Ajouter un modèle" : "Modifier un modèle"}
      </h3>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex gap-2">
          <div className="w-full">
            <label className="text-white text-sm" htmlFor="brand">
              Marque
            </label>
            <Input
              id="brand"
              placeholder="Apple"
              type="text"
              className="text-noir-900"
              {...form.register("brand")}
            />
          </div>
          <div className="w-full">
            <label className="text-white text-sm" htmlFor="name">
              Nom du modèle
            </label>
            <Input
              id="name"
              placeholder="iPhone 13 Pro Max"
              type="text"
              className="text-noir-900"
              {...form.register("name")}
            />
          </div>
        </div>

        <div className="flex items-center">
          <label className="text-white text-sm w-full" htmlFor="isActive">
            Afficher le modèle et ses variantes sur le site
          </label>
          <Input
            id="isActive"
            placeholder="iPhone 13 Pro Max"
            type="checkbox"
            className="h-5 w-5"
            defaultChecked={initialValues.isActive}
            {...form.register("isActive")}
          />
          <BottomGradient />
        </div>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {type === "add" ? "Ajouter ce modèle" : "Modifier ce modèle"}
          <BottomGradient />
        </button>

        <FormError message={error} />
        <FormSuccess message={success} />
      </form>
    </div>
  );
}
