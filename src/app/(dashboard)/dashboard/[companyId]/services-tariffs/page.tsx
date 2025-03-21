import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import AddTariffCard from "./_components/add-tariff-card";
import { getServicesAction } from "@/actions/service/get-services-action";
import { Service } from "@/types/interfaces/service";
import { getObjectsAction } from "@/actions/object/get-objects-action";

interface PageProps {
  params: {
    companyId: string;
  };
}

async function ServicesTariffsPage({ params }: PageProps) {
  const { companyId } = params;
  const services: Service[] = await getServicesAction();

  //dobavit interface object
  const objects = await getObjectsAction({
    pagination: { offset: 0, limit: 100 },
    sort: { field: "id", order: "asc" },
    companyId,
  });

  const companyObjectIds = objects.data.map((obj: { id: string }) => obj.id);
  const filteredServices = services.filter(
    (service) => service.objectId && companyObjectIds.includes(service.objectId)
  );

  return (
    <div className="flex  gap-4 flex-wrap">
      <Card className="p-3 flex flex-col items-center justify-center space-y-4 w-[350px]">
        <AddTariffCard objects={objects.data} />
      </Card>

      {filteredServices.map((service) => (
        <Card key={service.id} className="w-[350px]">
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>{service.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {service.logo}
            Price: ${service.price}
          </CardContent>
          {/* <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter> */}
        </Card>
      ))}
    </div>
  );
}

export default ServicesTariffsPage;
