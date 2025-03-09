"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Object } from "@/types/interfaces/object";
import AddTariffForm from "@/components/Forms/AddTariffForm";
import { cn } from "@/lib/utils";

interface AddTariffCardProps {
  objects: Object[];
  className?: string;
  noIcon?: boolean;
}

export default function AddTariffCard({
  objects,
  className,
  noIcon,
}: AddTariffCardProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {!noIcon && (
            <Button variant="outline" className="w-20 h-20 rounded-full">
              <CirclePlus className={cn("w-8 h-8", className)} />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Створення тарифу</DialogTitle>
            <DialogDescription>
              Введіть необхідну інформацію щоб створити статтю нарахувань
            </DialogDescription>
          </DialogHeader>
          <AddTariffForm
            objects={objects}
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Додати статтю нарахувань
      </p>
    </>
  );
}
