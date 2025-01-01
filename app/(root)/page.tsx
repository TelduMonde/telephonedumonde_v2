import Link from "next/link";

// import ProductCardDetail from "@/components/Boutique/DetailProduit/ProductCardDetail";
import Slider from "@/components/Home/Slider";
import PopularModels from "@/components/Home/PopularModels";

import { BottomGradient } from "@/components/ui/BottomGradient";
import { TbTruckDelivery } from "react-icons/tb";
import { ImPriceTags } from "react-icons/im";
import { BiWorld } from "react-icons/bi";
// import WorldMap from "@/components/ui/world-map";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 lg:gap-20">
      {/* SLIDER */}
      <section className="">
        <div className="h-[95vh] px-1 lg:px-0 sm:h-[60vh] lg:h-[60vh] 2xl:h-[75vh] bg-gradient-to-t from-noir-900 via-noir-900 to-noir-900">
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

          <div className="sm:hidden px-4 relative h-4/5 justify-center rounded-md wrapper mt-8">
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

      {/* PRESENTATOIN PHONE */}
      <section className="wrapper">
        <div className="text-base md:text-2xl font-font1 flex flex-col gap-2">
          <p className="gradient-text">
            Vous n&apos;arrivez pas à faire un choix de téléphone ?
          </p>
          <span className="text-xl md:text-5xl font-font1 font-extrabold text-white">
            Nos modèles les plus populaires !
          </span>
          <PopularModels />
        </div>
      </section>

      {/* BANDEAU */}
      <div className="sm:flex lg:-mt-4 bg-gradient-to-t from-primary-600 to-primary-900 w-full h-12 flex-center flex-wrap gap-4 lg:gap-20">
        <p className="hidden sm:flex gap-2 items-center text-white uppercase text-xs lg:text-base font-fontb font-bold tracking-widest">
          <BiWorld size={20} /> Produits du monde
        </p>
        <p className="flex gap-2 items-center text-white uppercase text-xs lg:text-base font-fontb font-bold tracking-widest">
          <TbTruckDelivery size={20} /> Livraison 5 à 7 jours
        </p>

        <p className="flex gap-2 items-center text-white uppercase text-xs lg:text-base font-fontb font-bold tracking-widest">
          <ImPriceTags size={20} /> Prix réduit
        </p>
      </div>

      {/* CEST QUOI ? */}
      <section className="relative">
        <p className="flex-center items-center pt-4 lg:pt-0 text-base md:text-xl font-font1 text-white">
          <span className="text-lg lg:text-xl font-font1 inline-block text-center p-4 border-b rounded-md text-white tracking-widest">
            Téléphone du monde, c&apos;est quoi ?
          </span>{" "}
        </p>
        {/* <div className="wrapper flex-center">
          <WorldMap
            dots={[
              {
                start: { lat: 48.8566, lng: 2.3522 }, // Paris
                end: { lat: 48.8566, lng: 2.3522 }, // Paris (même point)
              },
              {
                start: { lat: 48.8566, lng: 2.3522 }, // Paris, France
                end: { lat: 45.4215, lng: -75.6972 }, // Ottawa, Canada
              },
              {
                start: { lat: 48.8566, lng: 2.3522 }, // Paris, France
                end: { lat: 1.3521, lng: 103.8198 }, // Singapore
              },
              {
                start: { lat: 48.8566, lng: 2.3522 }, // Paris, France
                end: { lat: 39.9042, lng: 116.4074 }, // Beijing, China
              },
              {
                start: { lat: 48.8566, lng: 2.3522 }, // Paris, France
                end: { lat: 35.6895, lng: 139.6917 }, // Tokyo, Japan
              },
            ]}
          />
        </div> */}
        {/* <div className="flex-center px-4">
          <div className="flex flex-col justify-center gap-2 lg:gap-10 sm:w-1/2 pl-8 pr-8 bg-gradient-to-t from-primary-900 to-primary-500 sm:h-[400px] rounded-md">
            <p className="flex-center items-center pt-4 lg:pt-0 text-base md:text-xl font-font1 text-white ">
              <span className="text-lg lg:text-xl font-font1 inline-block text-center p-4 border rounded-md text-white tracking-widest">
                Téléphone du monde, c&apos;est quoi ?
              </span>{" "}
            </p>
            <p className="pb-4 lg:pb-0 text-white text-sm md:text-sm font-font1">
              C&apos;est tout simplement la plateforme qui vous facilite
              l&apos;achat de smartphones du monde entier.
              <br /> <br /> Le concept est simple : vous êtes en France ou
              n&apos;importe où dans le monde, et vous aimeriez avoir un
              téléphone venant du Japon ou de l&apos;Inde ? Tout simplement
              parce que les téléphones provenant de ces pays sont beaucoup moins
              cher ? <br /> <br /> Faites le bon choix et économisez énormément
              d&apos;argent pour un smartphone qui aura les mêmes
              caractéristiques que celui que vous achèteriez plein pot en France
              !
            </p>
          </div>
        </div> */}
        <button className="mt-4 lg:mt-10 mx-auto bg-gradient-to-r group/btn from-primary-900 to-primary-500 w-2/3 lg:w-1/3 text-white text-center flex items-center justify-center rounded-md h-10 uppercase font-font1 font-extrabold tracking-wide z-10">
          <Link href="/concept">En savoir plus</Link>
        </button>
      </section>
      {/* <div className="mt-10 flex-center gap-20 p-4">
        <VelocityScroll
          text="CANADA - JAPON - INDE - SINGAPORE - "
          default_velocity={1}
          className="text-white uppercase text-lg font-font1 font-bold tracking-widest"
        />
      </div> */}
    </div>
  );
}
