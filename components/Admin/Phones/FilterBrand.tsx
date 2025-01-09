"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils/utils";

const FilterBrand = () => {
  const router = useRouter();
  const [brands, setBrands] = useState<string[]>([]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`/api/models/brands`);
        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }
        const data = await response.json(); // Obtenez tout l'objet
        const brands = data.uniqueBrands;
        setBrands(brands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {}, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [brands, searchParams, router]);

  const onSelectCategory = (category: string) => {
    let newUrl = "";
    if (category && category !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "brand",
        value: category,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["brand"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <select
      onChange={(event) => onSelectCategory(event.target.value)}
      className="w-full lg:w-52 p-1 px-4 rounded-md bg-noir-900 text-xs text-white border border-white/70"
    >
      <option value="" className="text-xs bg-noir-900">
        Toutes les marques
      </option>
      {brands.map((brand) => (
        <option key={brand} value={brand}>
          {brand}
        </option>
      ))}
    </select>
  );
};

export default FilterBrand;
