import { getObjectsAction } from "@/actions/object/get-objects-action";
import CreateOrderForm from "@/components/Forms/CreateOrderForm";

interface PageProps {
  params: {
    companyId: string;
  };
}

export default async function CreateOrderPage({ params }: PageProps) {
  const { companyId } = params;

  const objects = await getObjectsAction({
    pagination: { offset: 0, limit: 100 },
    sort: { field: "id", order: "asc" },
    companyId,
  });

  return (
    <div className="h-full flex justify-center items-center">
      <CreateOrderForm objects={objects.data} companyId={companyId} />
    </div>
  );
}
