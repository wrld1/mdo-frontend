"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { updateObjectAction } from "@/actions/object/update-object-action";
import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type FormData = {
  address: string;
  type: "ApartmentBuilding";
};

export function UpdateObjectModal({ objectId }: { objectId: string }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const { toast } = useToast();
  const params = useParams();
  const companyId = Array.isArray(params.companyId)
    ? params.companyId[0]
    : params.companyId;
  const queryClient = useQueryClient();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await updateObjectAction(data, objectId, companyId);
      if (!result?.error) {
        toast({
          title: "Успішно",
          description: "Об'єкт успішно відредаговано",
        });
        setOpen(false);
        reset();
        queryClient.invalidateQueries({ queryKey: ["get-objects"] });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Не вдалося оновити об'єкт. Спробуйте пізніше",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="inline-flex">
          <Pencil className="h-4 w-4 mr-2 " />
          Редагувати
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редагування об&apos;єкту</DialogTitle>
          <DialogDescription>
            Змініть властивості. Натисніть зберегти зміни коли ви готові.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Адреса
              </Label>
              <Input
                id="address"
                className="col-span-3"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className="text-red-500 text-sm col-start-2 col-span-3">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Тип
              </Label>
              <Select
                onValueChange={(value) =>
                  register("type").onChange({ target: { value } })
                }
                defaultValue="ApartmentBuilding"
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ApartmentBuilding">
                    Багатоквартирний будинок
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Зберегти зміни</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
