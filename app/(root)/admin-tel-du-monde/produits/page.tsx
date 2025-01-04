"use client";
import AddCountryBtn from "@/components/Admin/Phones/AddCountryBtn";
import AddModelButton from "@/components/Admin/Phones/addModelBtn";
import DeleteModalButton from "@/components/Admin/Phones/DeleteModalBtn";

import FilterBrand from "@/components/Admin/Phones/FilterBrand";
import { Search } from "@/components/Admin/Phones/Search";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ModelPhone } from "@/types";
import EditModelButton from "@/components/Admin/Phones/EditModelBtn";
import { useCurrentUser } from "@/lib/utils/use-current-user";
import { Pagination } from "@/components/shared/Pagination";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const user = useCurrentUser();

  const [models, setModels] = useState<{
    totalPages: number;
    data: ModelPhone[];
  }>({ totalPages: 0, data: [] });

  const page = Number(searchParams.get("page")) || 1;
  const searchText = searchParams.get("query") || "";
  const brand = searchParams.get("brand") || "";

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(
          `/api/models?query=${searchText}&page=${page}&brand=${brand}`,
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

    fetchModels();
  }, [page, brand, searchText]);

  // console.log("MODELE", models);

  return (
    <section className="wrapper flex flex-col gap-8">
      <div className="flex gap-12 items-center justify-between">
        <h2 className="font-font1 text-white">
          Tous les modèles ({models.data.length})
        </h2>
        <div className="flex gap-4">
          <AddModelButton />
          <AddCountryBtn userId={user?.id} />
          {/* <ShowCountry /> */}
        </div>
      </div>

      <div className="flex gap-2">
        <Search />
        <FilterBrand />
      </div>

      {models.data.length === 0 && (
        <p className="text-white bg-noir-800 p-2 text-center rounded-md">
          Aucun modèle
        </p>
      )}

      <div className="grid grid-cols-1 gap-2">
        {models.data.map((model) => (
          <div
            key={model.id}
            className="bg-noir-800 grid grid-cols-6 items-center text-white font-font1 p-2 rounded-md "
          >
            <p>{model.brand}</p>
            <p>{model.name}</p>
            <p>{model.variantCount} variantes</p>
            <p>Actif : {model.isActive ? "Oui" : "Non"}</p>
            <div className="flex gap-2 justify-center items-center">
              <EditModelButton
                userId={user?.id}
                model={model}
                modelId={model.id}
              />
              <DeleteModalButton modelId={model.id} />
            </div>
            <Link
              href={`/admin-tel-du-monde/produits/${model.slug}`}
              className="bg-noir-600 text-center rounded-md hover:bg-noir-200"
            >
              Voir les variantes
            </Link>
          </div>
        ))}
        <div className="bg-gradient-to-l from-noir-800 to-noir-900 flex justify-end p-1 rounded-md">
          {models.totalPages > 1 && (
            <div className="">
              <Pagination page={page} totalPages={models.totalPages} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
