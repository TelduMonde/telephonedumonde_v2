"use client";

import { useEffect, useState } from "react";
import CardModel from "../Cards/CardModel";
import { useSearchParams } from "next/navigation";
import { ShowModelProps } from "@/types";

export default function PopularModels() {
  const searchParams = useSearchParams();

  const [models, setModels] = useState<ShowModelProps>({
    data: [],
    totalPages: 0,
  });

  const page = Number(searchParams.get("page")) || 1;
  const searchText = searchParams.get("query") || "";
  const brand = searchParams.get("brand") || "";

  useEffect(() => {
    const fetchActiveModels = async () => {
      try {
        const response = await fetch(
          `/api/models/home?query=${searchText}&page=${page}&brand=${brand}`,
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
      }
    };

    fetchActiveModels();
  }, [page, brand, searchText]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-center gap-4 lg:gap-12 w-full lg:h-[340px] mt-10 rounded-md">
      {models.data.map((model) => (
        <CardModel key={model.id} model={model} />
      ))}
    </div>
  );
}
