import { getUserAction } from "@/actions/get-user-action";
import ChangePasswordForm from "@/components/Forms/ChangePasswordForm";
import SendVerificationForm from "@/components/Forms/SendVerificationForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUser } from "@/utils/functions.server";

async function SendVerificationModal() {
  const { userId } = await getUser();
  let user;
  if (userId) {
    user = await getUserAction(userId);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={user?.isVerified}>
          {user?.isVerified ? "Пошту підтверджено" : "Підтвердіть пошту"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Підтвердження аканту</DialogTitle>
          <DialogDescription>
            Введіть email адресу для отримання посилання на підтвердження
            акаунту
          </DialogDescription>
        </DialogHeader>
        <SendVerificationForm />
      </DialogContent>
    </Dialog>
  );
}

export default SendVerificationModal;
