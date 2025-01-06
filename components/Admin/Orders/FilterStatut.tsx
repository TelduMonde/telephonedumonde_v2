"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils/utils";

const FilterStatut = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const [statut, setStatut] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {}, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchParams, router]);

  const onSelectStatut = (statut: string) => {
    let newUrl = "";
    if (statut && statut !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "statut",
        value: statut,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["statut"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <select
      onChange={(event) => onSelectStatut(event.target.value)}
      className="p-1 px-4 rounded-md bg-noir-900 text-xs text-white border border-white/70"
    >
      <option value="" className="text-xs bg-noir-900">
        Trier par statut
      </option>
      <option value="pending">Traitement</option>
      <option value="processing">En cours de préparation</option>
      <option value="shipped">Envoyée</option>
      <option value="delivered">Livrée</option>
      <option value="cancelled">Annulée</option>
    </select>
  );
};

export default FilterStatut;
