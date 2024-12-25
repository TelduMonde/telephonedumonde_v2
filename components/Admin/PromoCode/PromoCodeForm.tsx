"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { promoCodeFormSchema } from "@/lib/validator";

import { FormError } from "@/components/shared/Form/FormError";
import { FormSuccess } from "@/components/shared/Form/FormSucess";

import DatePicker from "react-datepicker";
import { fr } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";

import { BottomGradient } from "@/components/ui/BottomGradient";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/utils/use-current-user";

type PromoCodeFormProps = {
  type: "add" | "edit";
  setIsModalOpen: (isOpen: boolean) => void;
  promoCode?: {
    code: string;
    discount: number;
    isActive: boolean;
    expiresAt: Date;
  };
  promoCodeId?: string;
};

export default function PromoCodeForm({
  type,
  promoCode,
  promoCodeId,
  setIsModalOpen,
}: PromoCodeFormProps) {
  const router = useRouter();

  const user = useCurrentUser();
  const userId = user?.id;

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    promoCode?.expiresAt ? new Date(promoCode.expiresAt) : new Date()
  );

  const initialValues =
    type === "edit"
      ? {
          code: promoCode?.code,
          discount: promoCode?.discount || 1,
          isActive: promoCode?.isActive,
          expiresAt: promoCode?.expiresAt,
        }
      : {
          code: "",
          discount: 1, // Minimum valide
          isActive: true,
          expiresAt: new Date(),
        };

  const form = useForm<z.infer<typeof promoCodeFormSchema>>({
    resolver: zodResolver(promoCodeFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
    shouldFocusError: false, // Désactiver le focus automatique sur les erreurs
  });

  const { setValue } = form;

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setValue("expiresAt", date); // Sync with react-hook-form
    }
  };

  async function onSubmit(values: z.infer<typeof promoCodeFormSchema>) {
    setError("");
    setSuccess("");

    if (type === "add") {
      console.log("Données du formulaire :", values);
      try {
        if (!userId) {
          setError("Une erreur est survenue");
          return;
        }

        const response = await fetch("/api/promo-codes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            userId,
          }),
        });

        if (!response.ok) {
          throw new Error("Echec de l'ajout du code promo");
        }

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        form.reset();
        setSuccess("Code promo créé avec succès");
        setIsModalOpen(false);
        router.refresh();
        toast.success("Code promo créé avec succès");
      } catch (error) {
        console.log(error);
        setError("Erreur lors de l'ajout du modèle");
        toast.error("Erreur lors de l'ajout du modèle");
      }
    }

    if (type === "edit") {
      try {
        const response = await fetch(`/api/promo-codes/${promoCodeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Echec de la modification du code promo");
        }

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        form.reset();
        setSuccess("Code promo modifié avec succès");
        setIsModalOpen(false);
        router.refresh();
        toast.success("Code promo modifié avec succès");
      } catch (error) {
        console.log(error);
        setError("Erreur lors de la modification du modèle");
        toast.error("Erreur lors de la modification du modèle");
      }
    }
  }

  useEffect(() => {
    console.log("Erreurs du formulaire :", form.formState.errors);
  }, [form.formState.errors]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-white text-xl font-font1 tracking-widest font-bold">
        {type === "add" ? "Ajouter un code promo" : "Modifier un code promo"}
      </h3>

      <form
        onSubmit={(e) => {
          e.preventDefault(); // Empêche le comportement par défaut
          form.handleSubmit(onSubmit)(); // Appelle le gestionnaire de soumission
        }}
        className="flex flex-col gap-4"
      >
        {" "}
        <div className="flex gap-2">
          <div className="w-full flex flex-col gap-1">
            <label className="text-white text-sm" htmlFor="code">
              Nom du code promo
            </label>
            <input
              id="code"
              placeholder="code"
              type="text"
              className="text-noir-900 p-1 rounded-md placeholder:text-xs"
              {...form.register("code")}
            />
          </div>

          <div className="w-full flex flex-col gap-1">
            <label className="text-white text-sm" htmlFor="expiresAt">
              Date et heure d&apos;expiration
            </label>
            <DatePicker
              id="expiresAt"
              locale={fr}
              selected={selectedDate}
              onChange={handleDateChange}
              showTimeSelect
              timeInputLabel="Heure :"
              dateFormat="dd/MM/yyyy HH:mm"
              wrapperClassName="datePicker"
              className="w-full text-noir-900 p-1 rounded-md placeholder:text-xs"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-full flex flex-col gap-1">
            <label className="text-white text-sm" htmlFor="discount">
              Pourcentage à appliquer
            </label>
            <input
              id="discount"
              placeholder="10"
              type="number"
              className="text-noir-900 p-1 rounded-md"
              {...form.register("discount")}
            />
          </div>
          <div className="w-full flex items-center gap-1 bg-noir-700 px-2 rounded-md">
            <label className="text-white text-sm w-full" htmlFor="isActive">
              Activer le code promo :
            </label>
            <input
              id="isActive"
              type="checkbox"
              className="h-5 w-5"
              defaultChecked={initialValues.isActive}
              {...form.register("isActive")}
            />
          </div>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <button
          id="submit"
          type="submit"
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          {type === "add" ? "Créer un code promo" : "Modifier le code promo"}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}
