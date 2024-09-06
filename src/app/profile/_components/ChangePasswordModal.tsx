import ChangePasswordForm from "@/components/Forms/ChangePasswordForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ChangePasswordModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Змінити пароль
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Зміна паролю</DialogTitle>
          {/* <DialogDescription>
            Забули пароль? Введіть адрес вашої електроної пошти і ми надішлемо
            посилання на відновлення паролю
          </DialogDescription> */}
        </DialogHeader>
        <ChangePasswordForm />
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordModal;
