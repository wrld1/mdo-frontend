import { getUserAction } from "@/actions/get-user-action";
import { getUser } from "@/lib/dal";

export default async function ProfilePage() {
  const { userId } = await getUser();
  let user;
  if (userId) {
    user = await getUserAction(userId);
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-2">
        <h2 className="text-lg font-semibold">Personal Information</h2>
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