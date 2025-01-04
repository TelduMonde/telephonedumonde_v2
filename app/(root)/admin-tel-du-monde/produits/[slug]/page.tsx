import { currentUser } from "@/lib/auth";
import ShowVariant from "@/components/Admin/Phones/ShowVariant";

export default async function VariantsAdminPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const user = await currentUser();

  return (
    <>
      <ShowVariant userId={user?.id} modelSlug={slug} />
    </>
  );
}
