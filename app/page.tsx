"use client";

import { useEffect } from "react";
import { supabase } from "../src/lib/supabase";

export default function Home() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.from("users").select("*");

      console.log(data);
      console.log(error);
    };

    test();
  }, []);

  return (
    <div className="flex flex-col items-center  min-h-screen py-2">
      <div className="text-4xl font-bold">뿌엥 로그</div>
    </div>
  );
}
