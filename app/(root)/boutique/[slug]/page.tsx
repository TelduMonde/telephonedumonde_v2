import ProductCardDetail from "@/components/Boutique/DetailProduit/ProductCardDetail";
import React from "react";

export default async function page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;

  return (
    <section className="flex-center">
      <ProductCardDetail modelId={slug} />
    </section>
  );
}
