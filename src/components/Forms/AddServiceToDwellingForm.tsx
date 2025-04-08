"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getServicesAction } from "@/actions/service/get-services-action";
import { addServiceToDwellingAction } from "@/actions/dwelling/add-service-to-dwelling-action";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
};

type FormData = {
  serviceId: number;
};

export function AddServiceToDwellingForm({
  dwellingId,
}: {
  dwellingId: number;
}) {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const { toast } = useToast();
  const params = useParams();
  const objectId = Array.isArray(params.objectId)
    ? params.objectId[0]
    : params.objectId;
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const result = await getServicesAction(objectId as string);
        if (!result.error) {
          setServices(result);
        } else {
          toast({
            title: "Помилка",
            description: "Не вдалося завантажити список послуг",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchServices();
    }
  }, [open, objectId, toast]);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await addServiceToDwellingAction(
        data.serviceId,
        dwellingId,
        objectId as string
      );
      if (!result?.error) {
        toast({
          title: "Успішно",
          description: "Послугу успішно додано до приміщення",
        });
        setOpen(false);
        reset();
        queryClient.invalidateQueries({ queryKey: ["get-dwelling-services"] });
      } else {
        toast({
          title: "Помилка",
          description: result.message || "Не вдалося додати послугу",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося додати послугу. Спробуйте пізніше",
        variant: "destructive",
      });
    }
  };

  const handleServiceChange = (value: string) => {
    setValue("serviceId", parseInt(value, 10));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Додати лічильники
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Додати лічильники до приміщення</DialogTitle>
          <DialogDescription>
            Оберіть лічильник зі списку доступних лічильників об&apos;єкту
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Послуга
              </Label>
              <div className="col-span-3">
                <Select onValueChange={handleServiceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть послугу" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <SelectItem value="loading" disabled>
                        Завантаження...
                      </SelectItem>
                    ) : services.length > 0 ? (
                      services.map((service) => (
                        <SelectItem
                          key={service.id}
                          value={service.id.toString()}
                        >
                          {service.name} - {service.price} грн
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>
                        Немає доступних послуг
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.serviceId && (
                  <p className="text-red-500 text-sm mt-1">
                    Необхідно обрати послугу
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              Додати послугу
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
