import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import AddTariffCard from "./_components/add-tariff-card";
import { getServicesAction } from "@/actions/get-services-action";
import { Service } from "@/types/interfaces/service";

async function ServicesTariffsPage() {
  const services: Service[] = await getServicesAction();

  return (
    <div className="flex justify-between">
      <AddTariffCard />

      {services.map((service) => (
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
