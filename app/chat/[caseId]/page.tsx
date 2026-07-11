"use client";

import { useParams } from "next/navigation";
import Image from "next/image";

export default function ChatPage() {
  const params = useParams();
  const caseId = params.caseId as string;

  return (
    <div className="text-2xl flex min-h-screen flex-col items-center justify-center gap-10 p-4">
      <h1 className="text-3xl font-bold">뿌엥 로그</h1>
      {/* <div className="rounded-xl p-5 shadow-md bg-gray-100"> */}
      <Image
        src="/judge/gavel.png"
        alt="뿌엥"
        width={120}
        height={120}
        priority
        className="rounded-full hover:scale-105 transition-transform duration-300"
      />
      <h1>뿌엥 법정에 오신 것을 환영합니다.</h1>
    </div>
    // </div>
  );
}
