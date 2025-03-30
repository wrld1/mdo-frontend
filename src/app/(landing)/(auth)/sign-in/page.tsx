import SignInForm from "@/components/Forms/SignInForm";
import SignUpForm from "@/components/Forms/SignUpForm";
import ForgotPasswordModal from "@/components/ui/ForgotPasswordModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoveRight } from "lucide-react";
import Link from "next/link";

function SignInPage() {
  return (
    <div className="container min-h-full flex items-center justify-center flex-col">
      <div className="space-y-4 text-center mb-6">
        <h1 className="text-3xl font-bold">Авторизація</h1>
        <p className="text-muted-foreground">Увійдіть в свій акаунт</p>
      </div>
      <div className="lg:w-1/2 flex items-center justify-center">
        <Tabs defaultValue="email" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phoneNumber">Номер телефону</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <SignInForm authType="email"/>
          </TabsContent>
          <TabsContent value="phoneNumber">
            <SignInForm authType="phone"/>
          </TabsContent>
        </Tabs>
      </div>

      <ForgotPasswordModal />

      <Link
        href="/sign-up"
        className="mt-2 text-sm hover:underline flex gap-2 items-center"
      >
        <span>Ще не маєте акаунту?</span>
        <MoveRight className="text-foreground-primary" size={16} />
      </Link>
    </div>
  );
}

export default SignInPage;
