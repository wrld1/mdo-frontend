import { getObjectAction } from "@/actions/object/get-object-action";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import DwellingListTable from "./_components/dwelling-list-table";
import { UpdateObjectModal } from "./_components/update-object-modal";
import { Object } from "@/types/interfaces/object";

export default async function ObjectPage({
  params,
}: {
  params: { objectId: string };
}) {
  const object: Object = await getObjectAction(params.objectId);

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
      <DwellingListTable objectId={params.objectId} />
    </div>
  );
}
