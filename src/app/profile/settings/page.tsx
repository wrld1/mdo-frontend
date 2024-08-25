import { getUserAction } from "@/actions/get-user-action";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/ui/LogoutButton";
import { getUser } from "@/lib/dal";

export default async function ProfileSettings() {
  const { userId } = await getUser();
  let user;
  if (userId) {
    user = await getUserAction(userId);
  }

  return (
    <div className="grid gap-2">
      <h2 className="text-lg font-semibold">Account Settings</h2>
      <div className="grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Password</span>
          <Button variant="outline" size="sm">
            Change Password
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span>Email</span>

          <Button variant="outline" size="sm" disabled={user?.isVerified}>
            {user?.isVerified ? "Пошту підтверджено" : "Підтвердіть пошту"}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span>Вийти з акаунту</span>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
