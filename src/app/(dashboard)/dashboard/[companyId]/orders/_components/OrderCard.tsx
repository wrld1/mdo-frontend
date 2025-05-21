"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderCardProps {
  title: string;
  description: string;
  objectName: string;
  userNickname: string;
  price: string;
  orderType: string;
  onTakeOrder?: () => void;
  customActionSlot?: React.ReactNode;
  showDefaultButton?: boolean;
}

export default function OrderCard({
  title = "Website Redesign",
  description = "Complete redesign of company website with modern UI/UX principles",
  objectName = "Corporate Website",
  userNickname = "DesignPro",
  price = "$1,200",
  orderType = "Design",
  onTakeOrder = () => console.log("Order taken"),
  customActionSlot,
  showDefaultButton = true,
}: OrderCardProps) {
  const [isTaken, setIsTaken] = useState(false);

  const handleTakeOrder = () => {
    setIsTaken(true);
    if (onTakeOrder) {
      onTakeOrder();
    }
  };

  return (
    <Card className="w-full max-w-md overflow-hidden border-0 shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-medium">{title}</CardTitle>
            <CardDescription className="mt-1 text-base">
              {description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-slate-50">
            {orderType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Об&lsquo;єкт:</span>
            <span className="font-medium">{objectName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Заявка від:</span>
            <span className="font-medium">{userNickname}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Ціна:</span>
            <span className="font-medium">{price}</span>
          </div>
        </div>
      </CardContent>
      {(customActionSlot || showDefaultButton) && (
        <CardFooter className="py-3 border-t bg-slate-50">
          {customActionSlot ? (
            <div className="w-full">{customActionSlot}</div>
          ) : showDefaultButton ? (
            <Button
              className="w-full mt-0 mx-auto"
              onClick={handleTakeOrder}
              disabled={isTaken}
            >
              {isTaken ? "Заявка в роботі" : "Взяти Заявку"}
            </Button>
          ) : null}
        </CardFooter>
      )}
    </Card>
  );
}
