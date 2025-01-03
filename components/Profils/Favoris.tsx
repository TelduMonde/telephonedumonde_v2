// "use client";
import { getFavoriteVariants } from "@/lib/actions/user.actions";
import CardVariant from "../Cards/CardVariant";
import { VariantFav } from "@/types";

export default async function Favoris({ userId }: { userId: string }) {
  const favoris = await getFavoriteVariants({ userId });

  return (
    <div className="w-full">
      {favoris.length === 0 ? (
        <p className="bg-noir-800 p-4 rounded-md uppercase text-white font-font1 flex-center">
          Aucun article en favoris
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoris.map((fav: { Variant: VariantFav }) => (
            <CardVariant
              key={fav.Variant.id}
              variant={fav.Variant}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
