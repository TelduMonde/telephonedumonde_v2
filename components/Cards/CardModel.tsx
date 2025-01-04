import { CardsModelProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function CardModel({ model }: { model: CardsModelProps }) {
  return (
    <Link
      href={`/boutique/${model.slug}`}
      className="relative group w-full lg:min-w-[300px] lg:min-h-[400px] pt-4 hover:shadow-2xl transition-all ease-in-out duration-300 rounded-md"
    >
      {/* IMAGE TEL */}
      <div className="w-full h-[200px] z-20 flex flex-center flex-col overflow-hidden">
        <Image
          src={model.firstImage || "/logo/telephone_du_monde.png"}
          height={200}
          width={200}
          alt={model.name}
          className="object-contain w-full h-full transition-transform ease-in-out duration-300 group-hover:scale-110"
        />
      </div>

      {/* INFOS */}
      <div className="bg-gradient-to-b from-noir-900 to-noir-800 h-[150px] sm:h-[150px] -mt-10 rounded-md transition-all ease-in-out duration-300 z-10">
        <div className="lg:wrapper">
          <p className="pt-12 pb-1 text-xs text-noir-100 text-center lg:pt-8">
            {model.brand}
          </p>
          <h3 className="text-white font-font1 text-base sm:text-lg text-center pb-2">
            {model.name}
          </h3>
          <p className="text-white font-font1 font-bold text-sm sm:text-xl text-center">
            <span className="text-xs font-normal">
              {"À".toUpperCase()} partir de{" "}
            </span>
            {model.minPrice} €
          </p>
        </div>
      </div>
    </Link>
  );
}
