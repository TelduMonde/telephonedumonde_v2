"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
// import { useCurrentUser } from "@/hooks/use-current-user";
import { userSettingSchema } from "@/lib/validator";
import { updateSettingUser } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BottomGradient } from "../ui/BottomGradient";
import { Address } from "@/types";

interface User {
  user: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    image?: string | null;
    role: string;
    addresses: Address[];
  };
}

export const UpdateUserForm = (user: User) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");

  const { update } = useSession();

  const form = useForm<z.infer<typeof userSettingSchema>>({
    resolver: zodResolver(userSettingSchema),
    defaultValues: {
      firstName: user.user.firstName || undefined,
      lastName: user.user.lastName || undefined,
      email: user.user.email || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof userSettingSchema>) => {
    setError("");

    const updatedValues = { ...values };

    if (values.firstName || values.lastName) {
      // Etre sûr que firstName et lastName ne sont pas undefined
      const firstName = values.firstName || "";
      const lastName = values.lastName || "";
      updatedValues.name = `${firstName} ${lastName}`.trim();
    }

    startTransition(() => {
      updateSettingUser(updatedValues)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            router.refresh();
            toast.success(data.success);
          }
        })
        .catch(() => setError("Une erreur est survenue"));
    });
  };

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {" "}
        <div className="flex flex-col gap-1">
          <label className="text-white/70 text-xs" htmlFor="nom">
            Nom
          </label>
          <input
            id="nom"
            placeholder="Nom"
            type="text"
            className="p-1 bg-noir-800 border-b text-white"
            {...form.register("lastName")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-white/70 text-xs" htmlFor="prenom">
            Prénom
          </label>
          <input
            id="prenom"
            placeholder="Prénom"
            type="text"
            className="p-1 bg-noir-800 border-b text-white"
            {...form.register("firstName")}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="bg-gradient-to-t px-2 relative group/btn from-primary-900 to-primary-500 block w-full text-white rounded-md h-10 font-medium"
        >
          {isPending ? "En cours..." : "Mettre à jour"}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
};
