"use client";

import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import BlurFade from "../magicui/blur-fade";
import DotPattern from "../magicui/dot-pattern";
import HeroCard from "./HeroCard";
import Link from "next/link";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-custom-radial bg-cover bg-center bg-no-repeat relative overflow-hidden -mt-[72px]">
      {/* <div
        className="absolute inset-0 bg-custom-radial bg-cover bg-center bg-no-repeat"
        style={{ filter: "blur(5px)" }}
      ></div> */}
      <DotPattern className="z-0" />
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between rounded-xl p-4 sm:p-8 relative z-10">
        <div className="w-full lg:w-1/2 lg:mb-0">
          <BlurFade delay={0.15}>
            <h1 className="text-black text-5xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Сучасна система обліку нарахувань
            </h1>
          </BlurFade>

          <BlurFade delay={0.2}>
            <p className="text-black text-lg sm:text-xl opacity-60 font-normal mb-8 max-w-[564px]">
              Система Osbb Management - бухгалтерський та абонентський облік в
              порядку, співвласники та мешканці - задоволені.
            </p>
          </BlurFade>

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

          <BlurFade delay={0.35}>
            <div className="flex flex-row items-center space-x-8">
              <div className="flex flex-col items-start">
                <span className="text-black text-[44px] font-semibold">
                  23k+
                </span>
                <span className="text-black text-base font-normal">Users</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-black text-[44px] font-semibold">
                  1M+
                </span>
                <span className="text-black text-base font-normal">
                  Download
                </span>
              </div>
            </div>
          </BlurFade>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-4 lg:mt-0">
          <div className="relative w-full max-w-[400px] sm:max-w-[520px] md:max-w-[600px] lg:max-w-3xl h-[550px] sm:h-[650px] md:h-[700px] lg:h-[750px]">
            <HeroCard
              src="/images/card1.webp"
              alt="Hero image"
              width={490}
              height={259}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[420px] md:w-[490px] lg:w-[490px]"
              isVisible={isVisible}
              initialTransform="translate(-45%, -120%) rotate(8deg)"
            />
            <HeroCard
              src="/images/card2.webp"
              alt="Hero image"
              width={294}
              height={305}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[252px] md:w-[294px] lg:w-[294px]"
              isVisible={isVisible}
              initialTransform="translate(-85%, -30%) rotate(-8deg)"
            />
            <HeroCard
              src="/images/card3.webp"
              alt="Hero image"
              width={274}
              height={305}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[235px] md:w-[274px] lg:w-[274px]"
              isVisible={isVisible}
              initialTransform="translate(-10%, 10%) rotate(16deg)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
