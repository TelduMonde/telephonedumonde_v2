/* eslint-disable react/no-unescaped-entities */
import { LoginForm } from "@/components/Auth/Form/LoginForm";
import { Suspense } from "react";

export default function page() {
  return (
    <section className="p-4 w-full mt-10 md:w-1/3 mx-auto">
      <p className="text-red-500 font-bold font-fontb mb-4">
        Il y a eu une erreur lors de l'authentification avec Google. Veuillez
        réessayer.
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </section>
  );
}
