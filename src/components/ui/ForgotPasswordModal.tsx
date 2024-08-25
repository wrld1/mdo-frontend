import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ForgotPasswordForm from "../Forms/ForgotPasswordForm";

function ForgotPasswordModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="mt-2 text-sm hover:underline flex gap-2 items-center cursor-pointer">
          Забули пароль?
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Відновлення паролю</DialogTitle>
          <DialogDescription>
            Забули пароль? Введіть адрес вашої електроної пошти і ми надішлемо
            посилання на відновлення паролю
          </DialogDescription>
        </DialogHeader>
        <ForgotPasswordForm />
      </DialogContent>
    </Dialog>
  );
}

export default ForgotPasswordModal;
