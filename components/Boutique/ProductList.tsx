"use client";

import { useEffect, useState } from "react";
import CardModel from "../Cards/CardModel";
import { useSearchParams } from "next/navigation";
import { ShowModelProps } from "@/types";
import { Pagination } from "../shared/Pagination";

export default function ProductList() {
  const searchParams = useSearchParams();

  const [models, setModels] = useState<ShowModelProps>({
    data: [],
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const page = Number(searchParams.get("page")) || 1;
  const searchText = searchParams.get("query") || "";
  const brand = searchParams.get("brand") || "";

  useEffect(() => {
    const fetchActiveModels = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/models/actifs?query=${searchText}&page=${page}&brand=${brand}`,
          {
            headers: {
              method: "GET",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching models:", errorData);
          throw new Error("Failed to fetch models");
        }

        const data = await response.json();
        setModels(data);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveModels();
  }, [page, brand, searchText]);

  return (
    <div className="w-full">
      {isLoading ? (
        <p className="bg-noir-800 p-4 rounded-md text-white font-font1 flex-center">
          Chargement...
        </p>
      ) : models.data.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {models.data.map((model) => (
              <CardModel key={model.id} model={model} />
            ))}
          </div>
          <div className="bg-gradient-to-l from-noir-800 to-noir-900 flex justify-end p-1 rounded-md">
            {models.totalPages > 1 && (
              <div className="">
                <Pagination page={page} totalPages={models.totalPages} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="bg-noir-800 p-4 rounded-md text-white font-font1 flex-center">
          Aucun modèle trouvé
        </p>
      )}
    </div>
  );
}
