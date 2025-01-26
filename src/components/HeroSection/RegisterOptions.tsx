"use client";

import BlurFade from "../magicui/blur-fade";
import { Button } from "../ui/button";
import { getUserAction } from "@/actions/user/get-user-action";
import { verifyUser } from "@/utils/functions.server";
import { useEffect, useState } from "react";
import { User } from "@/types/interfaces/user";
import Link from "next/link";

export default function RegisterOptions() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { userId } = await verifyUser();
      if (userId) {
        const userData = await getUserAction(userId);
        setUser(userData);
      }
    }
    fetchData();
  }, []);

  if (user) {
    return null;
  }

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
