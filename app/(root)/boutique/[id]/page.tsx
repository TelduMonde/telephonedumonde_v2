import ProductCardDetail from "@/components/Boutique/DetailProduit/ProductCardDetail";
import React from "react";

export default async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <section className="flex-center">
      <ProductCardDetail modelId={id} />
    </section>
  );
}
