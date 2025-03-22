import SignUpForm from "@/components/Forms/SignUpForm";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function SignUpPage() {
  return (
    <div className="container min-h-full flex items-center justify-center flex-col">
      <div className="space-y-4 text-center mb-6">
        <h1 className="text-3xl font-bold">Реєстрація</h1>
        <p className="text-muted-foreground">
          Зареєструйтеся щоб отримати доступ до всіх можливостей
        </p>
      </div>
      <div className="lg:w-1/2 flex items-center justify-center">
        <Tabs defaultValue="email" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phoneNumber">Номер телефону</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <SignUpForm />
          </TabsContent>
          <TabsContent value="phoneNumber"></TabsContent>
        </Tabs>
      </div>
      <Link
        href="/sign-in"
        className="mt-2 text-sm hover:underline flex gap-2 items-center"
      >
        <span> Вже зареєстровані?</span>
        <MoveRight className="text-foreground-primary" size={16} />
      </Link>
    </div>
  );
}

export default SignUpPage;
