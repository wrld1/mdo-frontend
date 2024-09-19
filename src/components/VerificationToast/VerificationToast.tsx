import { cookies } from "next/headers";
import ToastHandler from "./ToastHandler";

export default function VerificationToast() {
  const cookieStore = cookies();
  const showVerificationToast =
    cookieStore.get("showVerificationToast")?.value === "true";

  return <ToastHandler showVerificationToast={showVerificationToast} />;
}
