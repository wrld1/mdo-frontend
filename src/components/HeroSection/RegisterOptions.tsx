import { Button } from "../ui/button";
import Link from "next/link";
import BlurFade from "../magicui/blur-fade";

function RegisterOptions() {
  return (
    <BlurFade delay={0.25}>
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
    </BlurFade>
  );
}

export default RegisterOptions;
