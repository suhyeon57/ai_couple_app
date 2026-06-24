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

  return <div>뿌엥 재판소</div>;
}
