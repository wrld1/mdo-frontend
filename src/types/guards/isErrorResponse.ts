import { User } from "../interfaces/user";

export function isErrorResponse(
  res: User | { error: string }
): res is { error: string } {
  return (res as { error: string }).error !== undefined;
}
