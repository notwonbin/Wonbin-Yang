"use client";

import { useRef, useState } from "react";

/** 마우스를 올리면 글자가 잠깐 뒤섞였다가 왼쪽부터 제자리로 돌아온다 */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=?!";
const DURATION = 450; // ms

export default function Scramble({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  const raf = useRef(0);

  const run = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      const settled = Math.floor(p * text.length);
      setShown(
        [...text]
          .map((c, i) => (c === " " || i < settled ? c : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join(""),
      );
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <span onMouseEnter={run} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
