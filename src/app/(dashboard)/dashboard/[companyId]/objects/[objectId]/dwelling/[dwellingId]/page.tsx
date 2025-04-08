import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDwellingAction } from "@/actions/dwelling/get-dwelling-action";
import { Dwelling } from "@/types/interfaces/dwelling";
import { UpdateDwellingForm } from "@/components/Forms/UpdateDwellingForm";
import { AddServiceToDwellingForm } from "@/components/Forms/AddServiceToDwellingForm";
import { getServicesAction } from "@/actions/service/get-services-action";
import { Service } from "@/types/interfaces/service";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import Image from "next/image";

export default async function DwellingPage({
  params,
}: {
  params: { dwellingId: number };
}) {
  const dwelling: Dwelling = await getDwellingAction(params.dwellingId);

  const servicesResult = await getServicesAction();

  const services: Service[] = Array.isArray(servicesResult)
    ? servicesResult.filter(
        (service) => service.dwellingId === +params.dwellingId
      )
    : [];

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
            <div className="flex gap-2">
              <UpdateDwellingForm dwellingId={params.dwellingId} />
              <AddServiceToDwellingForm dwellingId={+params.dwellingId} />
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Підключені послуги</CardTitle>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]"></TableHead>
                  <TableHead>Назва</TableHead>
                  <TableHead>Опис</TableHead>
                  <TableHead className="text-right">Ціна</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      {/* {service.logo && (
                        <div className="relative h-10 w-10">
                          <Image
                            src={service.logo}
                            alt={service.name}
                            fill
                            className="rounded-md object-contain"
                          />
                        </div>
                      )} */}
                    </TableCell>
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell className="text-right">
                      {service.price} грн
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Немає підключених послуг</p>
          )}
        </CardContent>
      </Card>
      {/* <DwellingListTable objectId={params.objectId} /> */}
    </div>
  );
}
