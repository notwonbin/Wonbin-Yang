"use client";

import { useEffect } from "react";

/**
 * 지금 보는 프로젝트(화면 위쪽 1/3 지점을 지나는 섹션)에 data-current 를 붙임.
 * → 지금 프로젝트의 위쪽 구분선은 숨김 (ProjectSection.module.css) — 첫 프로젝트처럼 위가 깨끗하게
 */
export default function SectionFocus() {
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-section]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          sections.forEach((s) => s.toggleAttribute("data-current", s === e.target));
        }
      },
      { rootMargin: "-33% 0px -66% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      sections.forEach((s) => s.removeAttribute("data-current"));
    };
  }, []);
  return null;
}
