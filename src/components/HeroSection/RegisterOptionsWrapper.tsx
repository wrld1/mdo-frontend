import { getUserAction } from "@/actions/user/get-user-action";
import { verifyUser } from "@/utils/functions.server";
import RegisterOptions from "./RegisterOptions";
import { Button } from "../ui/button";
import Link from "next/link";

async function RegisterOptionsWrapper() {
  const { userId } = await verifyUser();
  const user = userId ? await getUserAction(userId) : undefined;

  if (user) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 mb-12">
      <Button className="w-[183px] h-[59px] text-base font-bold bg-black rounded-xl flex items-center justify-center">
        <Link href="/sign-up">Я мешканець</Link>
      </Button>
      <Button
        variant="secondary"
        className="h-[59px] text-base font-bold rounded-xl flex  items-center justify-center border-2 hover:bg-white"
      >
        <Link href="/register-company">Зареєструвати компанію</Link>
      </Button>
    </div>
  );
}

export default RegisterOptionsWrapper;
