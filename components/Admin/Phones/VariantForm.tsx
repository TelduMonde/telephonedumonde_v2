"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { variantFormSchema } from "@/lib/validator";

import { useUploadThing } from "@/lib/uploadthing";

import { Input } from "@/components/ui/input";
import { FormError } from "@/components/shared/Form/FormError";
import { FormSuccess } from "@/components/shared/Form/FormSucess";
import { BottomGradient } from "@/components/ui/BottomGradient";
import { toast } from "sonner";
import { MdDeleteOutline } from "react-icons/md";

type CountryProps = {
  id: string;
  name: string;
};

type VariantFormProps = {
  userId: string | undefined;
  type: "add" | "edit";
  modelSlug?: string;
  modelId?: string;
  variantID?: string;
  variant?: {
    id: string;
    price: number;
    memory: number;
    color: string;
    country: string;
    countryId: string;
    description: string;
    stock: number;
    imageUrl: string[];
    isActive: boolean;
    modelId: string;
  };
  setIsModalOpen: (isOpen: boolean) => void;
};

export default function VariantForm({
  type,
  modelSlug,
  // modelId,
  variant,
  setIsModalOpen,
}: VariantFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [countries, setCountries] = useState<CountryProps[]>([]);

  const variantId = variant?.id;

  //! Récupérer les pays
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch(`/api/country`, {
          headers: {
            method: "GET",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }

        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    fetchCountry();
  }, []);

  //! GESTION & ORDRE DES IMAGES
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Fichiers sélectionnés
  // const [existingImages, setExistingImages] = useState<string[]>(
  //   variant?.imageUrl || []
  // );
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]); // Images à supprimer
  const { startUpload } = useUploadThing("imageUploader");
  const [imageUrls, setImageUrls] = useState<string[]>(variant?.imageUrl || []);

  const moveImageLeft = (index: number) => {
    if (index === 0) return;
    const newOrder = [...imageUrls];
    [newOrder[index - 1], newOrder[index]] = [
      newOrder[index],
      newOrder[index - 1],
    ];
    setImageUrls(newOrder);
  };

  const moveImageRight = (index: number) => {
    if (index === imageUrls.length - 1) return;
    const newOrder = [...imageUrls];
    [newOrder[index + 1], newOrder[index]] = [
      newOrder[index],
      newOrder[index + 1],
    ];
    setImageUrls(newOrder);
  };

  //! Supprimer une image sélectionnée
  const handleRemoveExistingImage = (imageUrl: string) => {
    setImageUrls((prevUrls) => prevUrls.filter((image) => image !== imageUrl));
    setImagesToDelete((prevImages) => [...prevImages, imageUrl]);
  };

  useEffect(() => {
    if (selectedFiles.length > 0) {
      const newImageUrls = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImageUrls((prevUrls) => [...prevUrls, ...newImageUrls]);
    }
  }, [selectedFiles]);

  //! Initialiser les valeurs du formulaire
  const initialValues =
    variant && type === "edit"
      ? {
          id: variant?.id,
          price: variant?.price,
          memory: variant?.memory,
          color: variant?.color,
          country: variant?.country,
          countryId: variant?.countryId,
          description: variant?.description,
          imageUrl: imageUrls,
          stock: variant?.stock,
          isActive: variant?.isActive,
          modelSlug: modelSlug,
        }
      : {
          price: 0,
          memory: 0,
          color: "",
          country: "",
          countryId: "",
          description: "",
          imageUrl: [],
          stock: 0,
          isActive: true,
          modelSlug: modelSlug || "",
        };

  const [isChecked, setIsChecked] = useState(initialValues.isActive);

  const form = useForm<z.infer<typeof variantFormSchema>>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    setIsChecked(initialValues.isActive);
    // console.log("initialValues.isActive", initialValues.isActive);
  }, [initialValues.isActive]);

  const selectedCountry =
    countries.find((country) => country.id === variant?.countryId) || null;

  console.log("IMAGE URLS", imageUrls);

  //! Soumettre le formulaire
  async function onSubmit(values: z.infer<typeof variantFormSchema>) {
    setError("");
    setSuccess("");

    //! Ajouter une variante
    if (type === "add") {
      try {
        if (!modelSlug) {
          setError("modelId est requis pour ajouter une variante.");
          return;
        }

        if (imageUrls.length === 0) {
          setError("Aucune image n'a été uploadée.");
          toast.error("Aucune image n'a été uploadée.");
          return;
        }

        // Étape 1 : Upload des nouvelles images **
        const imageUploadUrls: string[] = [];
        if (selectedFiles.length > 0) {
          const uploadedImages = await startUpload(selectedFiles, {
            variantId: modelSlug,
          });

          if (!uploadedImages || uploadedImages.length === 0) {
            throw new Error("Échec de l'upload des images.");
          }

          uploadedImages.forEach((file) => imageUploadUrls.push(file.url));
        }

        // Étape 2 : Assigner les images dans le bon ordre **
        const finalImageUrls = [
          ...imageUploadUrls, // Images uploadées (nouvelles)
          ...imageUrls.filter((url) => !url.startsWith("blob:")), // Images existantes
        ];
        values.imageUrl = finalImageUrls;

        // Crée la variante
        const response = await fetch(`/api/variants/${modelSlug}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            modelSlug,
            memory: values.memory,
            color: values.color,
            countryId: values.country || null,
            price: values.price,
            description: values.description || "",
            stock: values.stock || 0,
            isActive: values.isActive ?? true,
            images: values.imageUrl,
          }),
        });

        // Vérifiez la réponse
        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            "Erreur lors de la création de la variante :",
            errorData
          );
          setError("Erreur lors de la création de la variante.");
          toast.error("Erreur lors de la création de la variante.");
          return;
        }

        setSelectedFiles([]);
        setSuccess("Variante et images ajoutées avec succès !");
        setIsModalOpen(false);

        window.location.href = window.location.href;
        router.refresh();
        toast.success("Variante ajoutée avec succès !");
      } catch (error) {
        console.error("Erreur dans onSubmit :", error);
        setError("Erreur lors de l'ajout de la variante.");
        toast.error("Erreur lors de l'ajout de la variante.");
      }
    }

    //! Modifier une variante
    if (type === "edit") {
      try {
        if (!modelSlug) {
          setError("modelSlug est requis pour ajouter une variante.");
          return;
        }

        if (!variant?.modelId) {
          setError("modelId est requis pour modifier une variante.");
          return;
        }

        // Étape 1 : Upload des nouvelles images (si existantes) **
        const newUploadedUrls: string[] = [];
        if (selectedFiles.length > 0) {
          const uploadedImages = await startUpload(selectedFiles, {
            variantId: modelSlug,
          });

          if (!uploadedImages || uploadedImages.length === 0) {
            toast.error("Échec de l'upload des images.");
            throw new Error("Échec de l'upload des images.");
          }

          uploadedImages.forEach((file) => newUploadedUrls.push(file.url));
        }

        //  Étape 2 : Assigner les images dans le bon ordre **
        const finalImageUrls = [
          ...newUploadedUrls, // Images uploadées
          ...imageUrls.filter((url) => !url.startsWith("blob:")), // Images existantes
        ];
        values.imageUrl = finalImageUrls;

        if (!variantId) {
          setError("variantId est requis pour éditer une variante.");
          return;
        }

        const countryId =
          values.country === initialValues.country
            ? initialValues.countryId
            : values.country;

        // Modifier la variante
        const response = await fetch(`/api/variants/${modelSlug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            variantId: variantId,
            memory: values.memory,
            color: values.color,
            countryId: countryId,
            price: values.price,
            description: values.description || "",
            stock: values.stock || 0,
            isActive: values.isActive ?? true,
            images: values.imageUrl, // Images dans l'ordre défini
            imagesToDelete,
          }),
        });

        // Vérifiez la réponse
        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            "Erreur lors de la modification de la variante :",
            errorData
          );
          setError("Erreur lors de la modification de la variante.");
          toast.error("Erreur lors de la modification de la variante.");
          return;
        }

        setSelectedFiles([]);
        setSuccess("Variante modifiée avec succès !");
        setIsModalOpen(false);
        router.refresh();
        window.location.href = window.location.href;
        toast.success("Variante modifiée avec succès !");
      } catch (error) {
        console.error("Erreur dans onSubmit :", error);
        setError("Erreur lors de l'édition de la variante.");
        toast.error("Erreur lors de l'édition de la variante.");
      }
    }
  }

  //! Afficher le formulaire
  return (
    <div className="flex flex-col gap-8">
      <h3 className="flex gap-3 text-white text-xl font-font1 tracking-widest">
        {type === "add" ? "Ajouter un modèle |" : "Modifier un modèle |"}
        <div className="flex gap-2">
          <Input
            id="isActive"
            type="checkbox"
            className="h-5 w-5 mt-1"
            checked={isChecked}
            {...form.register("isActive", {
              onChange: () => setIsChecked(!isChecked),
            })}
          />
          <p>{isChecked ? "Actuellement actif" : "Actuellement désactivé"}</p>
        </div>
      </h3>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex gap-4">
          <div>
            <label className="text-white text-sm" htmlFor="price">
              Prix
            </label>
            <Input
              id="price"
              type="number"
              className="text-noir-900"
              defaultValue={initialValues.price}
              {...form.register("price", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="text-white text-sm" htmlFor="memory">
              Stockage
            </label>
            <Input
              id="memory"
              type="number"
              className="text-noir-900"
              defaultValue={initialValues.memory}
              {...form.register("memory", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="text-white text-sm" htmlFor="color">
              Couleur
            </label>
            <Input
              id="color"
              placeholder="Blanc Neige"
              type="text"
              className="text-noir-900"
              defaultValue={initialValues.color}
              {...form.register("color")}
            />
          </div>

          <div className="">
            <label className="text-white text-sm" htmlFor="country">
              {!selectedCountry
                ? "-- Pays de provenance --"
                : `Pays actuel : ${selectedCountry.name}`}
            </label>
            <select
              id="country"
              {...form.register("country")}
              className="text-noir-900 w-52 h-10 rounded-md"
              defaultValue={type === "edit" ? selectedCountry?.id : ""}
            >
              <option value="">
                {!initialValues.country
                  ? "-- Sélectionnez un pays --"
                  : "Changer de pays"}
              </option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div></div>

          <div>
            <label className="text-white text-sm" htmlFor="stock">
              Stock
            </label>
            <Input
              id="stock"
              type="number"
              className="text-noir-900"
              defaultValue={initialValues.stock}
              {...form.register("stock", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white text-sm" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Description du téléphone"
            className="text-noir-900 text-sm rounded-md p-2 h-32"
            defaultValue={initialValues.description}
            {...form.register("description")}
          />
        </div>

        {/* Upload des Images */}
        <div className="flex gap-4 items-center flex-wrap font-font1">
          <label className="text-white text-sm" htmlFor="images">
            {type === "add" ? "Ajouter les images" : "Rajouter des images"}
          </label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                setSelectedFiles(Array.from(files));
              }
            }}
            className="text-noir-900 text-xs rounded-md"
          />
          <div className="flex gap-1">
            {imageUrls.map((image, index) => (
              <div key={image} className="relative flex flex-col gap-1">
                <div className="rounded-md object-cover h-40 w-40 mx-auto ">
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-md object-cover h-48 w-48 mx-auto"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => moveImageLeft(index)}
                    className="bg-white text-noir-800 rounded-md tracking-widest font-semibold text-xs mt-1 py-1 px-1"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImageRight(index)}
                    className="bg-white text-noir-800 rounded-md tracking-widest font-semibold text-xs mt-1 py-1 px-1"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(image)}
                    className="text-red-500 text-xs bg-primary-900 rounded-md tracking-widest font-semibold mt-2 p-1"
                  >
                    <MdDeleteOutline
                      size={10}
                      className="text-white hover:text-white/80"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Afficher les images existantes */}
          {/* {type === "edit" && (
            <div className="flex gap-1">
              {imageUrls.map((image, index) => (
                <div key={image} className="relative">
                  <div className="rounded-md object-cover h-48 w-48 mx-auto">
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded-md object-cover h-48 w-48 mx-auto"
                    />
                  </div>
                  <div className="absolute top-0 right-0 flex flex-col">
                    <button
                      type="button"
                      onClick={() => moveImageUp(index)}
                      className="bg-white text-noir-800 rounded-md tracking-widest font-semibold mt-1 py-1 px-2 mx-auto"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImageDown(index)}
                      className="bg-white text-noir-800 rounded-md tracking-widest font-semibold mt-1 py-1 px-2 mx-auto"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(image)}
                      className="text-red-500 text-xs"
                    >
                      Supp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )} */}
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {type === "add" ? "Ajouter la variante →" : "Modifier la variante →"}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}
