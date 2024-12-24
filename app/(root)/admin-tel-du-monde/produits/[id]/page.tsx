import { currentUser } from "@/lib/auth";
import ShowVariant from "@/components/Admin/Phones/ShowVariant";

export default async function VariantsAdminPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;
  const user = await currentUser();

  return (
    <>
      <ShowVariant userId={user?.id} modelId={id} />
    </>
  );
}
