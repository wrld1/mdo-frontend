"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

export default function CountdownRedirect() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [progress, router]);

  return (
    <div className="mt-4 w-full">
      <p className="mb-4">Перенаправляємо на головну сторінку ...</p>
      <div className="animate-pulse">
        <Progress value={progress} className="w-full" />
      </div>
    </div>
  );
}
