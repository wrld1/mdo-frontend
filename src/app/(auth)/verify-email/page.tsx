import ResetPasswordForm from "@/components/Forms/ResetPasswordForm";
import SignInForm from "@/components/Forms/SignInForm";
import VerifyEmailForm from "@/components/Forms/VerifyEmailForm";
import ForgotPasswordModal from "@/components/ui/ForgotPasswordModal";
import { MoveRight } from "lucide-react";
import Link from "next/link";

function VerifyEmailPage() {
  return (
    <div className="container min-h-full flex items-center justify-center flex-col mt-[100px]">
      <div className="space-y-4 text-center mb-6">
        <h1 className="text-3xl font-bold">Підтвердження акаунту</h1>
      </div>
      <div className="lg:w-1/2 flex items-center justify-center">
        <VerifyEmailForm />
      </div>
    </div>
  );
}

export default VerifyEmailPage;
