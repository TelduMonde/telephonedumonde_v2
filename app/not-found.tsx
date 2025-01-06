/* eslint-disable react/no-unescaped-entities */
import { BottomGradient } from "@/components/ui/BottomGradient";
import Link from "next/link";
import React from "react";

export default function notfound() {
  return (
    <div className="flex flex-col gap-8 h-[30rem] flex-center ">
      <h1 className=" font-font1 text-3xl font-bold uppercase text-white">
        404 | Page introuvable
      </h1>
      <button className="bg-gradient-to-t px-2 relative group/btn font-font1 from-primary-900 font-bold to-primary-500 block w-full lg:w-1/3 text-white uppercase rounded-md h-10">
        <Link href="/boutique">Retour à la boutique</Link>
        <BottomGradient />
      </button>
    </div>
  );
}
