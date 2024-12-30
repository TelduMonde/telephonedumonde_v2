"use client";
import React, { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
// import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils/utils";

import { MdOutlineSearch } from "react-icons/md";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils/utils";

export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";
      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  return (
    <div className="">
      <div className="flex gap-2">
        <MdOutlineSearch size={25} className="hidden lg:flex text-white" />
        <input
          type="text"
          placeholder="Recherche..."
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-1 px-4 rounded-md bg-noir-900 text-xs text-white border border-white/70"
        />
      </div>
    </div>
  );
};
