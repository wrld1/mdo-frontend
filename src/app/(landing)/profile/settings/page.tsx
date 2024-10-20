import { getUserAction } from "@/actions/get-user-action";
import LogoutButton from "@/components/ui/LogoutButton";
import { verifyUser } from "@/utils/functions.server";
import EmailRow from "./_components/EmailRow";

export default async function ProfileSettings() {
  const { userId } = await verifyUser();
  let user;
  if (userId) {
    user = await getUserAction(userId);
  }

  return (
    <div className="grid gap-2">
      <h2 className="text-lg font-semibold">Налаштування Акаунту</h2>
      <div className="grid gap-2 text-sm text-muted-foreground">
        {/* <div className="flex items-center justify-between">
          <span>Пароль</span>
          <ChangePasswordModal />
        </div> */}
        {user && (
          <EmailRow userIsVerified={user.isVerified} userEmail={user.email} />
        )}

        <div className="flex items-center justify-between">
          <span>Вийти з акаунту</span>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
