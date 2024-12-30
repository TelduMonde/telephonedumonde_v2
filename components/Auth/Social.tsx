"use client";

// On importe signIn depuis next-auth/react quand on est dans un client component
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";

export function Social() {
  const onClick = (provider: "google") => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div className="flex justify-center items-center w-full gap-x-2">
      <button
        className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full bg-noir-800 hover:bg-noir-700 text-black rounded-md h-10 font-medium shadow-input"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </button>
    </div>
  );
}
