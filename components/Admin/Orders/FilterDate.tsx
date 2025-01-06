"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils/utils";

const FilterDate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const [statut, setStatut] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {}, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchParams, router]);

  const onSelectDateRange = (dateRange: string) => {
    let newUrl = "";
    if (dateRange && dateRange !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "dateRange",
        value: dateRange,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["dateRange"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <select
      onChange={(event) => onSelectDateRange(event.target.value)}
      className="p-1 px-4 rounded-md bg-noir-900 text-xs text-white border border-white/70"
    >
      <option value="" className="text-xs bg-noir-900">
        Trier par date
      </option>
      <option value="24h">Dernières 24h</option>
      <option value="7d">Les 7 derniers jours</option>
      <option value="30d">Les 30 derniers jours</option>
      <option value="90d">Les 90 derniers jours</option>
      <option value="1y">Cette année</option>
    </select>
  );
};

export default FilterDate;
