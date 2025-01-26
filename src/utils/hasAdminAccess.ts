import { UserResponse } from "@/types/interfaces/user";

export const hasAdminAccess = (user: UserResponse | null) => {
  if (!user) {
    return false;
  }
  return user?.acl?.some((item) => item.resource === "admin") ?? false;
};
