"use client";
import React, { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";
// import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils/utils";

import { MdOutlineSearch } from "react-icons/md";

interface ModelProps {
  id: string;
  name: string;
  brand: string;
}

export const Search = () => {
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const handleSearchClick = () => {
    setIsSearchVisible((prev) => !prev);
  };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ModelProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Appeler l'API pour récupérer les résultats de recherche
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(`/api/models/search?query=${query}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.models || []);
        }
      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleResultClick = (modelId: string) => {
    router.push(`/boutique/${modelId}`);
    setIsSearchVisible(false);
  };

  //! Gérer le clic en dehors pour fermer la liste des résultats
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative flex flex-col items-start z-50"
      ref={searchContainerRef}
    >
      <div className="relative flex">
        <MdOutlineSearch
          size={25}
          className={`cursor-pointer z-20 hover:text-white/70 transition-transform duration-300 ${
            isSearchVisible ? "translate-x-[-215px]" : ""
          }`}
          onClick={handleSearchClick}
        />
        <input
          type="text"
          placeholder="Recherche..."
          onChange={(e) => setQuery(e.target.value)}
          className={`absolute right-0 h-full pl-4 pr-2 py-2 bg-noir-900 border-[1px] border-white rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-300 placeholder:text-xs ${
            isSearchVisible ? "w-[200px] opacity-100" : "w-0 opacity-0"
          }`}
        />
      </div>

      {isSearchVisible && results.length > 0 && (
        <div className="fixed top-16 right-40 bg-noir-900 text-white border border-white rounded-md shadow-lg z-50 w-[200px] max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <p className="p-2 text-sm">Chargement...</p>
          ) : (
            results.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result.id)}
                className="cursor-pointer px-4 py-2 hover:bg-primary-500 transition-all"
              >
                <p className="text-sm font-semibold">{result.name}</p>
                <p className="text-xs text-gray-400">{result.brand}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
