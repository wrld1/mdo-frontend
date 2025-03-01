import { getUserAction } from "@/actions/user/get-user-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyUser } from "@/utils/functions.server";
import Link from "next/link";

export default async function VerificationRequiredPage() {
  const { userId } = await verifyUser();
  const user = userId ? await getUserAction(userId) : undefined;

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Для продовження підтвердіть свій акаунт</CardTitle>
        </CardHeader>
        <CardContent>
          Як тільки ви підтвердите акаунт в листі що прийшов на пошту{" "}
          {user && "email" in user && (
            <span className="font-bold text-blue-500">{user.email}</span>
          )}
          , ви зможете перейти на дану сторінку. <br /> Якщо лист не прийшов
          спробуйте надіслати його через{" "}
          <span className="font-bold">Профіль</span> -{" "}
          <span className="font-bold">Налаштування</span>
          <br />
          Або зв`яжіться зі службою підтримки
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button>
            <Link href="/">Повернутися на головну</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
