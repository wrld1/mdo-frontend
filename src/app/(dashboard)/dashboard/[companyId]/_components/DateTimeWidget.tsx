import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function DateTimeWidget() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = now.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" /> Поточна дата та час
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-grow">
        <p className="text-4xl font-bold">{formattedTime}</p>
        <p className="text-lg text-muted-foreground">{formattedDate}</p>
      </CardContent>
    </Card>
  );
}
