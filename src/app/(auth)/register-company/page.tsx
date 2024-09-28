import Link from "next/link";
import { MoveRight } from "lucide-react";
import RegisterCompanyForm from "@/components/Forms/RegisterCompanyForm";

function RegisterCompanyPage() {
  return (
    <div className="container min-h-full flex items-center justify-center flex-col">
      <div className="space-y-4 text-center mb-6">
        <h1 className="text-3xl font-bold">Реєстрація компанії</h1>
        <p className="text-muted-foreground">
          Зареєструйте свою компанію для керування обліками
        </p>
      </div>
      <div className="lg:w-1/2 flex items-center justify-center">
        <RegisterCompanyForm />
      </div>
      <Link
        href="/sign-in"
        className="mt-2 text-sm hover:underline flex gap-2 items-center"
      >
        <span>
          Користувач вже існує? Авторизуйтесь і створіть компанію в своєму
          профілі
        </span>
        <MoveRight className="text-foreground-primary" size={16} />
      </Link>
    </div>
  );
}

export default RegisterCompanyPage;
