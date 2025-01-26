import { verifyAccountAction } from "@/actions/auth/verify-account-action";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import CountdownRedirect from "./_components/CountdownRedirect";

async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [token: string]: string | undefined };
}) {
  let ResultComponent = null;

  const token = searchParams?.token;

  if (!token) {
    return (
      <div className="container min-h-full flex items-center justify-center flex-col">
        <Card className="mx-auto mt-8 lg:w-1/2 flex flex-col justify-center bg-transparent">
          <CardHeader>
            <CardTitle>Підтвердження акаунту</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Помилка</AlertTitle>
              <AlertDescription>Невірне посилання</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Link href="/">
              <Button>Повернутися на головну сторінку</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const result = await verifyAccountAction({ token });

  if (result?.error) {
    ResultComponent = (
      <>
        <CardContent>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Помилка</AlertTitle>
            <AlertDescription>
              {result.error || "Підтвердження акаунту не успішне"}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button>
            <Link href="/">Повернутися на головну сторінку</Link>
          </Button>
        </CardFooter>
      </>
    );
  } else {
    ResultComponent = (
      <>
        <CardContent>
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Успішно</AlertTitle>
            <AlertDescription className="text-green-700">
              Ваш акаунт було успішно підтверджено
            </AlertDescription>
          </Alert>
        </CardContent>
        <div className="p-6 pt-0">
          <CountdownRedirect />
        </div>
      </>
    );
  }

  return (
    <div className="container min-h-full flex items-center justify-center flex-col mt-[100px]">
      <Card className="mx-auto mt-8 lg:w-1/2 flex flex-col justify-center bg-transparent">
        <CardHeader>
          <CardTitle>Підтвердження акаунту</CardTitle>
        </CardHeader>
        {ResultComponent}
      </Card>
    </div>
  );
}

export default VerifyEmailPage;
