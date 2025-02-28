/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import Slider from "@/components/Home/Slider";
import PopularModels from "@/components/Home/PopularModels";

import WorldMap from "@/components/ui/world-map";
import { Transition } from "@/components/shared/Transition";
import {
  BottomGradient,
  BottomGradient2,
} from "@/components/ui/BottomGradient";

import { TbTruckDelivery } from "react-icons/tb";
import { ImPriceTags } from "react-icons/im";
import { BiWorld } from "react-icons/bi";

import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Téléphone du Monde | Smartphones Internationaux à Prix Réduits",
  description:
    "Découvrez Téléphone du Monde, votre plateforme pour acheter des smartphones internationaux neufs et performants à des prix imbattables. Économisez dès aujourd'hui !",
  keywords: [
    "smartphones internationaux",
    "téléphones pas chers",
    "téléphones du monde",
    "acheter téléphone neuf",
    "smartphone prix réduit",
  ],
  // openGraph: {
  //   images: [
  //     { url: "https://www.nocap.fr/api/opengraph", width: 1200, height: 630 },
  //   ],
  // },
};

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-10 sm:gap-20">
        <Transition>
          {/* SLIDER */}
          <section className="">
            <div className=" px-1 lg:px-0 sm:h-[60vh] lg:h-[60vh] 2xl:h-[75vh] bg-gradient-to-t from-noir-900 via-noir-900 to-noir-900">
              <div className="hidden sm:block relative h-full w-full">
                <div className="h-full">
                  <Slider />
                </div>
                <h1 className="z-40 absolute top-3 left-1/2 transform -translate-x-1/2 text-xl font-font1 text-center inline-block p-4 mb-5 border rounded-md text-white tracking-widest">
                  Téléphone du Monde
                </h1>{" "}
                <Link
                  href="/boutique"
                  className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r px-2 group/btn from-primary-900  to-primary-500 w-1/3 text-white text-center flex items-center justify-center rounded-md h-10 uppercase font-font1 font-extrabold tracking-wide z-10"
                >
                  Voir la boutique
                  <BottomGradient />
                </Link>
              </div>

              <div className="sm:hidden px-4 relative h-[75vh] justify-center rounded-md wrapper mt-8">
                <div className="h-full">
                  <Slider />
                </div>
                <h1 className="z-40 absolute top-3 left-1/2 transform -translate-x-1/2 text-xs font-font1 inline-block p-4 mb-5 border rounded-md text-white tracking-widest">
                  Téléphone du Monde
                </h1>{" "}
                <Link
                  href="/boutique"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r group/btn from-primary-900 to-primary-500 w-2/3 text-white text-center flex items-center justify-center rounded-md h-10 uppercase font-font1 font-extrabold tracking-wide z-10"
                >
                  Voir la boutique
                  <BottomGradient />
                </Link>
              </div>
            </div>
          </section>
        </Transition>

        {/* PRESENTATOIN PHONE */}
        <Transition>
          <section className="wrapper">
            <div className="text-sm md:text-2xl font-font1 flex flex-col gap-2">
              <p className="gradient-text">
                Vous n&apos;arrivez pas à faire un choix de téléphone ?
              </p>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-font1 font-extrabold text-white">
                Nos modèles les plus populaires !
              </span>
              <PopularModels />
            </div>
          </section>
        </Transition>

        {/* BANDEAU */}
        <Transition>
          <div className="relative sm:flex lg:-mt-4 bg-gradient-to-t from-primary-600 to-primary-900 w-full h-12 flex-center flex-wrap gap-4 lg:gap-20">
            <p className="hidden sm:flex gap-2 items-center text-white uppercase text-xs lg:text-base font-fontb font-bold tracking-widest">
              <BiWorld size={20} /> Produits du monde
            </p>
            <p className="flex gap-2 items-center text-white uppercase text-xs lg:text-base font-fontb font-bold tracking-widest">
              <TbTruckDelivery size={20} /> Livraison 7 à 10 jours
            </p>

            <p className="flex gap-2 items-center text-white uppercase text-xs lg:text-base font-fontb font-bold tracking-widest">
              <ImPriceTags size={20} /> Prix réduit
            </p>
            <BottomGradient2 />
          </div>
        </Transition>

        {/* CEST QUOI ? */}
        {/* <Transition> */}
        <section className="relative wrapper flex flex-col gap-10">
          <div className="text-sm md:text-2xl font-font1 flex flex-col gap-2">
            <p className="gradient-text">
              Vous voulez en savoir plus sur notre concept ?
            </p>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-font1 font-extrabold text-white">
              Téléphone du monde, c&apos;est quoi ?
            </span>{" "}
          </div>
          <div className="flex-center flex-col gap-6 lg:flex-row lg:gap-10 w-full">
            <Suspense
              fallback={
                <div className="text-white">Chargement de la carte...</div>
              }
            >
              <WorldMap
                dots={[
                  {
                    start: { lat: 40.0, lng: 2.0 }, // France (ajusté)
                    end: { lat: 40.0, lng: 2.0 }, // France (même point, ajusté)
                  },
                  {
                    start: { lat: 40.0, lng: 2.0 }, // France (ajusté)
                    end: { lat: 45.4215, lng: -75.6972 }, // Ottawa, Canada
                  },
                  {
                    start: { lat: 40.0, lng: 2.0 }, // France (ajusté)
                    end: { lat: 1.3521, lng: 103.8198 }, // Singapore
                  },
                  {
                    start: { lat: 40.0, lng: 2.0 }, // France (ajusté)
                    end: { lat: 39.9042, lng: 116.4074 }, // Beijing, China
                  },
                  {
                    start: { lat: 40.0, lng: 2.0 }, // France (ajusté)
                    end: { lat: 28.6895, lng: 143.6917 }, // Tokyo, Japan
                  },
                  {
                    start: { lat: 40.0, lng: 2.0 }, // France (ajusté)
                    end: { lat: 40.7128, lng: -74.006 }, // New York, USA
                  },
                  {
                    start: { lat: 40.0, lng: 2.0 }, // France (ajusté)
                    end: { lat: 20.5937, lng: 78.9629 }, // India
                  },
                  {
                    start: { lat: 40.0, lng: 2.0 }, // France (ajusté)
                    end: { lat: 35.8617, lng: 104.1954 }, // China
                  },
                  {
                    start: { lat: 40.0, lng: 2.0 }, // France (ajusté)
                    end: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires, Argentina
                  },
                ]}
              />
            </Suspense>
            <div className="flex flex-col gap-10 justify-between">
              <p className="pb-4 lg:pb-0 text-white text-sm md:text-sm font-fontb">
                {" "}
                <span className="text-lg font-bold">
                  Bienvenue sur Téléphones du Monde, la plateforme qui
                  révolutionne l'achat de smartphones internationaux.
                </span>
                <br /> <br /> Le concept est simple : Découvrez des modèles de
                qualité provenant des quatre coins du globe, neufs et
                performants, sans payer le prix fort. Faites le choix malin et
                économisez sur l'achat de votre prochain smartphone tout en
                profitant des dernières technologies. <br /> <br /> Ne dépensez
                plus une fortune pour un smartphone dernier cri : faites le bon
                choix avec Téléphones du Monde et économisez dès aujourd'hui.
              </p>
              <button className="bg-gradient-to-t px-2 relative group/btn font-font1 from-primary-900 font-bold to-primary-500 block w-full text-white uppercase rounded-md h-10">
                <Link href="/concept">En savoir plus</Link>
                <BottomGradient />
              </button>
            </div>
          </div>
        </section>
        {/* </Transition> */}
      </div>
    </>
  );
}
