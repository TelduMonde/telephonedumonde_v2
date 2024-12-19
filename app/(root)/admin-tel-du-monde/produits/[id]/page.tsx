import React from "react";
import { showVariantsByModel } from "@/lib/actions/variant.actions";
import { currentUser } from "@/lib/auth";
import ShowVariant from "@/components/Admin/Phones/ShowVariant";

export default async function VariantsAdminPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const { id } = params;
  const user = await currentUser();
  const variants = (await showVariantsByModel(id)).map((variant) => ({
    ...variant,
    country: variant.country ? variant.country.name : "Unknown",
  }));

  return (
    <ShowVariant userId={user?.id} modelId={id} variants={variants || []} />
  );
}
