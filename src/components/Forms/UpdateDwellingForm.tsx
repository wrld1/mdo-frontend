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
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
// import { updateDwellingAction } from "@/actions/dwelling/update-dwelling-action";

type FormData = {
  number: number;
  floor?: number;
  entrance?: number;
};

export function UpdateDwellingForm({ dwellingId }: { dwellingId: number }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const { toast } = useToast();
  const params = useParams();
  const objectId = Array.isArray(params.objectId)
    ? params.objectId[0]
    : params.objectId;
  const queryClient = useQueryClient();

  //   const onSubmit = async (data: FormData) => {
  //     try {
  //       const result = await updateDwellingAction(data, dwellingId, objectId);
  //       if (!result?.error) {
  //         toast({
  //           title: "Успішно",
  //           description: "Приміщення успішно відредаговано",
  //         });
  //         setOpen(false);
  //         reset();
  //         queryClient.invalidateQueries({ queryKey: ["get-dwellings"] });
  //       }
  //     } catch (error) {
  //       toast({
  //         title: "Error",
  //         description: "Не вдалося оновити приміщення. Спробуйте пізніше",
  //         variant: "destructive",
  //       });
  //     }
  //   };

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
          <DialogTitle>Редагування приміщення</DialogTitle>
          <DialogDescription>
            Змініть властивості. Натисніть зберегти зміни коли ви готові.
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Номер
              </Label>
              <Input
                id="number"
                type="number"
                className="col-span-3"
                {...register("number", {
                  required: "Номер є обов'язковим",
                  valueAsNumber: true,
                  validate: (value) =>
                    Number.isInteger(value) || "Номер має бути цілим числом",
                })}
              />
              {errors.number && (
                <p className="text-red-500 text-sm col-start-2 col-span-3">
                  {errors.number.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="floor" className="text-right">
                Поверх
              </Label>
              <Input
                id="floor"
                type="number"
                className="col-span-3"
                {...register("floor", {
                  valueAsNumber: true,
                  validate: (value) =>
                    !value ||
                    Number.isInteger(value) ||
                    "Поверх має бути цілим числом",
                })}
              />
              {errors.floor && (
                <p className="text-red-500 text-sm col-start-2 col-span-3">
                  {errors.floor.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entrance" className="text-right">
                Під&apos;їзд
              </Label>
              <Input
                id="entrance"
                type="number"
                className="col-span-3"
                {...register("entrance", {
                  valueAsNumber: true,
                  validate: (value) =>
                    !value ||
                    Number.isInteger(value) ||
                    "Під'їзд має бути цілим числом",
                })}
              />
              {errors.entrance && (
                <p className="text-red-500 text-sm col-start-2 col-span-3">
                  {errors.entrance.message}
                </p>
              )}
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
