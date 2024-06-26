"use client";
import Image from "next/image";
import dashboardImage from "./dashboard_ex.png";
import dashboardDarkImage from "./dashboard_ex_dark.png";
import { useTheme } from "next-themes";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="px-16">
      <section className="flex flex-row items-center h-[calc(100vh-65px)] gap-4">
        <div className="flex flex-col items-center max-w-[40vw]">
          <p className="text-center text-6xl font-bold">로드림과 함께</p>
          <p className="text-center text-6xl font-bold text-purple-500">
            진로를 꿈꿔보세요
          </p>
          <p className="text-center text-xl text-gray-500 py-8">
            1500건 이상의 진로진학 데이터를 바탕으로 제공되는
            <br /> 생기부 맞춤형 학과와 진로, 후속 활동을 무료로 받아보세요.
          </p>
          <Button
            className="bg-purple-100"
            startContent={<FaArrowRight />}
            onClick={() => {
              router.push("/upload");
            }}
          >
            무료 분석 시작하기
          </Button>
        </div>
        <div className="flex-1 justify-center">
          <Image
            src={dashboardImage}
            alt="대시보드 예시"
            className="w-[calc(3992 * 4vh)] h-[calc(2079 * 4vh)]"
          />
        </div>
      </section>
    </div>
  );
}
