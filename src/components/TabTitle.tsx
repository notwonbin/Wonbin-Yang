"use client";

import { useEffect } from "react";

/** 다른 탭으로 나가면 탭 제목이 바뀌고, 돌아오면 잠깐 인사한 뒤 원래대로 */
const AWAY = "(•_•) come back soon";
const BACK = "(˘▽˘) welcome back";
const BACK_MS = 1600;

export default function TabTitle() {
  useEffect(() => {
    const original = document.title;
    let timer = 0;
    const onChange = () => {
      window.clearTimeout(timer);
      if (document.hidden) {
        document.title = AWAY;
      } else {
        document.title = BACK;
        timer = window.setTimeout(() => { document.title = original; }, BACK_MS);
      }
    };
    document.addEventListener("visibilitychange", onChange);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onChange);
      document.title = original;
    };
  }, []);
  return null;
}
