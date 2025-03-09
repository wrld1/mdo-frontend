import { getObjectAction } from "@/actions/object/get-object-action";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import DwellingListTable from "./_components/dwelling-list-table";
import { UpdateObjectModal } from "./_components/update-object-modal";
import { Object } from "@/types/interfaces/object";
import { Button } from "@/components/ui/button";
import AddTariffCard from "../../services-tariffs/_components/add-tariff-card";
import { getObjectsAction } from "@/actions/object/get-objects-action";

export default async function ObjectPage({
  params,
}: {
  params: { objectId: string; companyId: string };
}) {
  const { companyId } = params;
  const object: Object = await getObjectAction(params.objectId);

  const objects = await getObjectsAction({
    pagination: { offset: 0, limit: 100 },
    sort: { field: "id", order: "asc" },
    companyId,
  });

  return (
    <div className="p-6 space-y-4 flex flex-col">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{object.address}</CardTitle>
          <div className="flex space-between text-base w-full items-center">
            <div className="flex flex-col flex-1 text-muted-foreground mt-2">
              <span>Тип: {object.type}</span>
              <span>Унікальний номер: {object.id}</span>
            </div>
            <UpdateObjectModal objectId={params.objectId} />
          </div>
        </CardHeader>
      </Card>
      <div className="flex gap-4">
        <Button variant="secondary" className="flex items-center gap-2">
          <AddTariffCard objects={objects.data} noIcon={true} />
        </Button>
      </div>
      <DwellingListTable objectId={params.objectId} />
    </div>
  );
}
