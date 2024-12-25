"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";

import { userRegisterSchema } from "@/lib/validator";
import { register } from "@/lib/actions/auth.actions";

import { Input } from "@/components/ui/input";
import { FormError } from "@/components/shared/Form/FormError";
import { FormSuccess } from "@/components/shared/Form/FormSucess";

import { BottomGradient } from "@/components/ui/BottomGradient";
import { CardWrapper } from "../CardWrapper";
import { toast } from "sonner";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  //! Schema de validation
  const form = useForm<z.infer<typeof userRegisterSchema>>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  //! Fonction de soumission du formulaire
  const onSubmit = (values: z.infer<typeof userRegisterSchema>) => {
    // Reset des messages d'erreur et de succès
    setError("");
    setSuccess("");

    // Server Action (je peux aussi utiliser fetch ici)
    startTransition(() => {
      register(values).then((data: { error?: string; success?: string }) => {
        setError(data.error);
        setSuccess(data.success);
        toast.success("Votre compte a été créé avec succès !");
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Inscrivez-vous"
      backButtonLabel="Vous avez dèjà un compte ? Connectez-vous"
      backButtonHref="/se-connecter"
      showSocial
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex gap-2">
          <div>
            <label className="text-white text-sm" htmlFor="firstName">
              Prénom
            </label>
            <Input
              id="firstName"
              placeholder="Tyler"
              type="text"
              {...form.register("firstName")}
            />
            <BottomGradient />
          </div>

          <div>
            <label className="text-white text-sm" htmlFor="lastName">
              Nom
            </label>
            <Input
              id="lastName"
              placeholder="Brown"
              type="text"
              {...form.register("lastName")}
            />
            <BottomGradient />
          </div>
        </div>

        <div>
          <label className="text-white text-sm" htmlFor="mail">
            Email
          </label>
          <Input
            id="mail"
            placeholder="Tyler"
            type="text"
            {...form.register("email")}
          />
          <BottomGradient />
        </div>

        <div className="flex gap-2">
          <div>
            <label className="text-white text-sm" htmlFor="password">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
            />
            <BottomGradient />
          </div>

          <div>
            <label
              className="text-white text-sm"
              htmlFor="passwordConfirmation"
            >
              Confirmer le mot de passe
            </label>
            <Input
              id="passwordConfirmation"
              type="password"
              {...form.register("passwordConfirmation")}
            />
            <BottomGradient />
          </div>
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <button
          className="bg-gradient-to-t px-2 relative group/btn from-primary-900  to-primary-500 block w-full text-white rounded-md h-10 font-medium "
          type="submit"
          disabled={isPending}
        >
          Créer mon compte &rarr;
          <BottomGradient />
        </button>
      </form>
    </CardWrapper>
  );
};
