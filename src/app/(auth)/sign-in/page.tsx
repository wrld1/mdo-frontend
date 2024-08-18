import SignInForm from "@/components/Forms/SignInForm";
import { MoveRight } from "lucide-react";
import Link from "next/link";

function SignInPage() {
  return (
    <div className="container min-h-full flex items-center justify-center flex-col mt-[100px]">
      <div className="space-y-4 text-center mb-6">
        <h1 className="text-3xl font-bold">Авторизація</h1>
        <p className="text-muted-foreground">Увійдіть в свій акаунт</p>
      </div>
      <div className="lg:w-1/2 flex items-center justify-center">
        <SignInForm />
      </div>
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
