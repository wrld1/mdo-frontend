import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import DwellingListTable from "../../_components/dwelling-list-table";
import { UpdateObjectModal } from "../../_components/update-object-modal";
import { getDwellingAction } from "@/actions/dwelling/get-dwelling-action";
import { Dwelling } from "@/types/interfaces/dwelling";

export default async function DwellingPage({
  params,
}: {
  params: { dwellingId: number };
}) {
  const dwelling: Dwelling = await getDwellingAction(params.dwellingId);

  return (
    <div className="p-6 space-y-4 flex flex-col">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Квартира номер {dwelling.number}</CardTitle>
          <div className="flex space-between text-base w-full items-center">
            <div className="flex flex-col flex-1 text-muted-foreground mt-2">
              <span>Поверх: {dwelling.floor}</span>
              <span>Особовий рахунок номер {dwelling.id}</span>
            </div>
            {/* <UpdateObjectModal objectId={params.objectId} /> */}
          </div>
        </CardHeader>
      </Card>
      {/* <DwellingListTable objectId={params.objectId} /> */}
    </div>
  );
}
