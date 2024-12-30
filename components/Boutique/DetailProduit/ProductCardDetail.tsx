"use client";
import { BottomGradient } from "@/components/ui/BottomGradient";
import Gallery from "./Gallery";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/components/Panier/Context/CartContext";
import { toast } from "sonner";

type CountryProps = {
  id: string;
  name: string;
};

type VariantProps = {
  id: string;
  name: string;
  memory: number;
  color: string;
  price: number;
  country: CountryProps;
  description: string;
  isActive: boolean;
  images: string[];
  model: { id: string; name: string };
};

export default function ProductCardDetail({ modelId }: { modelId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  console.log("modelId", modelId);

  const [variants, setVariants] = useState<VariantProps[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<VariantProps | null>(
    null
  );

  const [options, setOptions] = useState({
    colors: [] as string[],
    memories: [] as number[],
    countries: [] as { id: string; name: string }[],
  });

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //! Charger les variantes et options initiales
  useEffect(() => {
    setIsLoading(true);
    const fetchVariants = async () => {
      try {
        const response = await fetch(
          `/api/variants/filtresVariants/${modelId}`
        );
        const data = await response.json();

        if (data.options) {
          setOptions(data.options);
          setVariants(data.filteredVariants);

          // Définir une variante par défaut
          if (data.filteredVariants.length > 0) {
            const defaultVariant = data.filteredVariants[0];
            setSelectedVariant(defaultVariant);
            setSelectedColor(defaultVariant.color);
            setSelectedMemory(defaultVariant.memory);
            setSelectedCountry(defaultVariant.country.id);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des variantes :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVariants();
  }, [modelId]);

  //! Mettre à jour la variante sélectionnée en fonction des filtres
  useEffect(() => {
    const filteredVariants = variants.filter(
      (v) =>
        (!selectedColor || v.color === selectedColor) &&
        (!selectedMemory || v.memory === selectedMemory) &&
        (!selectedCountry || v.country.id === selectedCountry)
    );

    if (filteredVariants.length > 0) {
      setSelectedVariant(filteredVariants[0]);
      setError(null);
    } else {
      setSelectedVariant(null);
      setError("Aucune variante ne correspond à votre sélection.");
    }
  }, [selectedColor, selectedMemory, selectedCountry, variants]);

  // Mettre à jour les paramètres dans l'URL
  const updateUrlParams = (key: string, value: string | number | null) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    if (value) {
      currentParams.set(key, value.toString());
    } else {
      currentParams.delete(key);
    }

    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  //! Gérer la sélection d'une option
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectOption = (key: "color" | "memory" | "country", value: any) => {
    switch (key) {
      case "color":
        setSelectedColor(value);
        updateUrlParams("color", value);
        break;
      case "memory":
        setSelectedMemory(value);
        updateUrlParams("memory", value);
        break;
      case "country":
        setSelectedCountry(value);
        updateUrlParams("country", value);
        break;
    }
  };

  //! Formater la description
  const formatDescription = (text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line.split(" ").map((word, idx) => (
          <span
            key={idx}
            className={word === word.toUpperCase() ? "font-bold" : ""}
          >
            {word}{" "}
          </span>
        ))}
        <br />
      </React.Fragment>
    ));
  };

  //! Ajouter au panier
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    if (selectedVariant) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: selectedVariant.id,
          name: selectedVariant.model.name,
          price: selectedVariant.price,
          quantity: 1,
          image: selectedVariant.images[0],
        },
      });
    }
    toast.success("Produit ajouté au panier !");
  };

  if (isLoading) {
    return (
      <div className="wrapper flex flex-col justify-center items-center gap-20">
        <div className="flex flex-col gap-2 md:flex-row md:gap-6">
          {/* Galerie d'images */}
          <Gallery imageUrl={[]} />

          <div className="text-white flex flex-col justify-between gap-6 px-4">
            <span className="text-xs font-fontb text-white/20"></span>
            <div className="flex justify-between items-center gap-10">
              <h3 className="font-font1 text-lg">Chargement...</h3>
              <p className="font-fontb text-2xl font-bold">
                {selectedVariant ? `${selectedVariant.price} €` : ""}
              </p>
            </div>

            {/* Sélection de pays */}
            <div className="flex flex-col gap-2">
              <p className="text-base">Pays</p>
              <div className="flex flex-wrap gap-2 lg:gap-6 text-xs"></div>
            </div>

            {/* Sélection de couleur */}
            <div className="flex flex-col gap-2">
              <p className="text-base">Couleur</p>
              <div className="flex flex-wrap gap-2 lg:gap-6 text-xs"></div>
            </div>

            {/* Sélection de capacité */}
            <div className="flex flex-col gap-2">
              <p className="text-base">Capacité</p>
              <div className="flex flex-wrap gap-2 lg:gap-6 text-xs"></div>
            </div>

            <button
              onClick={handleAddToCart}
              className="font-font1 text-lg uppercase bg-gradient-to-t px-2 relative group/btn from-primary-900 to-primary-500 block w-full text-white rounded-md h-10 font-medium  "
            >
              Ajouter au panier
              <BottomGradient />
            </button>
          </div>
        </div>

        <section className="wrapper bg-noir-800 rounded-md">
          <h4 className="wrapper text-white underline-offset-2 font-font1 text-lg uppercase font-bold">
            Description du produit :
          </h4>
          <p className="wrapper text-white font-font1 text-xs">
            {formatDescription(
              selectedVariant?.description || "Description non disponible"
            )}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="wrapper flex flex-col justify-center items-center gap-20">
      <div className="flex flex-col gap-2 md:flex-row md:gap-6">
        {/* Galerie d'images */}
        <Gallery imageUrl={selectedVariant?.images || []} />

        <div className="text-white flex flex-col justify-between gap-6 px-4">
          <span className="text-xs font-fontb text-white/20">Apple</span>
          <div className="flex justify-between items-center gap-10">
            <h3 className="font-font1 text-lg">
              {selectedVariant?.model.name || "Produit Indisponible"}
            </h3>
            <p className="font-fontb text-2xl font-bold">
              {selectedVariant ? `${selectedVariant.price} €` : ""}
            </p>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          {/* Sélection de pays */}
          <div className="flex flex-col gap-2">
            <p className="text-base">Pays</p>
            <div className="flex flex-wrap gap-2 lg:gap-6 text-xs">
              {options.countries.map((country: CountryProps) => (
                <button
                  key={country.id}
                  className={`font-font1 border rounded-md py-1 w-24 ${
                    selectedCountry === country.id
                      ? "bg-primary-500 text-white border-none"
                      : "hover:bg-noir-800 duration-300"
                  }`}
                  onClick={() => selectOption("country", country.id)}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sélection de couleur */}
          <div className="flex flex-col gap-2">
            <p className="text-base">Couleur</p>
            <div className="flex flex-wrap gap-2 lg:gap-6 text-xs">
              {options.colors.map((color) => (
                <button
                  key={color}
                  className={`font-font1 border rounded-md px-4 lg:py-1 w-24 ${
                    selectedColor === color
                      ? "bg-primary-500 text-white border-none hover:bg-none"
                      : "hover:bg-noir-800 duration-300"
                  }`}
                  onClick={() => selectOption("color", color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sélection de capacité */}
          <div className="flex flex-col gap-2">
            <p className="text-base">Capacité</p>
            <div className="flex flex-wrap gap-2 lg:gap-6 text-xs">
              {options.memories.map((memory) => (
                <button
                  key={memory}
                  className={`font-font1 border rounded-md py-1 w-24 ${
                    selectedMemory === memory
                      ? "bg-primary-500 text-white border-none"
                      : "hover:bg-noir-800 duration-300"
                  }`}
                  onClick={() => selectOption("memory", memory)}
                >
                  {memory} GO
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="font-font1 text-lg uppercase bg-gradient-to-t px-2 relative group/btn from-primary-900 to-primary-500 block w-full text-white rounded-md h-10 font-medium  "
          >
            Ajouter au panier
            <BottomGradient />
          </button>
        </div>
      </div>

      <section className="wrapper bg-noir-800 rounded-md">
        <h4 className="wrapper text-white underline-offset-2 font-font1 text-lg uppercase font-bold">
          Description du produit :
        </h4>
        <p className="wrapper text-white font-font1 text-xs">
          {formatDescription(
            selectedVariant?.description || "Description non disponible"
          )}
        </p>
      </section>
    </div>
  );
}
