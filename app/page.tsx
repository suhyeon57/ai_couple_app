"use client";

import { useState, useEffect } from "react";
import { supabase } from "../src/lib/supabase";
import Image from "next/image";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const test = async () => {
      const { data, error } = await supabase.from("users").select("*");

      console.log(data);
      console.log(error);
    };

    test();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      {/* 애니메이션: 마운트 시 translateY/opacity 전환, 호버 시 scale */}
      <div
        className={`transition-transform duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="text-4xl font-bold mb-4">뿌엥 로그</div>
        <Image
          src="/logo.png"
          alt="뿌엥"
          width={120}
          height={120}
          priority
          className="rounded-full hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex flex-low gap-4 items-center">
        <button className="px-4 py-2 bg-[#F79F9F] text-white rounded hover:bg-blue-600 transition-colors duration-300">
          Login
        </button>
        <button className="px-4 py-2 bg-[#F79F9F] text-white rounded hover:bg-blue-600 transition-colors duration-300">
          Sign up
        </button>
      </div>
    </div>
  );
}
