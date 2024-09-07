import { getUserAction } from "@/actions/get-user-action";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/ui/LogoutButton";
import { getUser } from "@/utils/functions.server";
import ChangePasswordModal from "../_components/ChangePasswordModal";
import SendVerificationModal from "../_components/SendVerificationModal";

export default async function ProfileSettings() {
  return (
    <div className="grid gap-2">
      <h2 className="text-lg font-semibold">Account Settings</h2>
      <div className="grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Password</span>
          <ChangePasswordModal />
        </div>
        <div className="flex items-center justify-between">
          <span>Email</span>
          <SendVerificationModal />
        </div>
        <div className="flex items-center justify-between">
          <span>Вийти з акаунту</span>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
