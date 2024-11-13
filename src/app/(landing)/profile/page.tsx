import { getUserAction } from "@/actions/get-user-action";

import { verifyUser } from "@/utils/functions.server";

export default async function ProfilePage() {
  const { userId } = await verifyUser();
  const user = userId ? await getUserAction(userId) : undefined;

  return (
    <div className="space-y-8">
      <div className="grid gap-2">
        <h2 className="text-lg font-semibold">Загальна інформація</h2>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Phone</span>
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Location</span>
            <span>San Francisco, CA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
