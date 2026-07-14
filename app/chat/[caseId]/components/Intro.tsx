import Image from "next/image";

export default function Intro() {
  return (
    <div className="text-xl flex min-h-screen flex-col items-center justify-center p-4">
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
  );
}
