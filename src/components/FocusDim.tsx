"use client";

import { useEffect } from "react";

/**
 * 화면 아래쪽에 걸쳐 보이는 다음 프로젝트 '카드'만 흐리게 → 지금 프로젝트에 집중.
 * 글자(제목·정보·설명)는 흐리지 않는다.
 *
 *  - 다음 카드의 윗선에서 0으로 시작해, 화면 맨 아래에서 최대가 되도록 점점 세진다.
 *    (위쪽은 아주 천천히, 아래로 갈수록 빠르게 짙어지는 곡선 — FocusDim.module.css)
 *  - 새 프로젝트로 넘어갈 때마다 흐림이 화면 아래에서부터 그 높이까지 천천히 차오른다 (RISE_MS)
 *
 * 각 프로젝트 갤러리 위에 흐림 층(ProjectSection 의 .fade)이 덮여 있고,
 * 여기서 '화면 기준' 흐림 시작/끝 위치를 그 층 안의 좌표로 바꿔 넣는다.
 */
const RISE_MS = 1100; // 흐림이 아래에서 올라오는 시간
/** 흐림 층을 갤러리보다 이만큼 크게 → 카드 가장자리도 칼같이 잘리지 않고 같이 번짐 */
const BLEED = 24;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export default function FocusDim() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let current = -1;     // 지금 프로젝트 번호
    let riseAt = 0;       // 차오르기 시작한 시각

    const sections = () => [...document.querySelectorAll<HTMLElement>("section[data-section]")];
    const ulOf = (s: Element) => s.querySelector<HTMLElement>(":scope > ul");

    /** 제자리에 멈췄을 때 다음 프로젝트 카드 윗선의 화면 y */
    const restingStart = (list: HTMLElement[]) => {
      const railTop = parseFloat(getComputedStyle(root).getPropertyValue("--rail-top")) || 24;
      // 첫 프로젝트는 위 여백이 따로 있어서 2·3번째로 잼 (모든 프로젝트 간격 동일)
      const a = list[1], b = list[2];
      const ul = b && ulOf(b);
      if (!a || !ul) return window.innerHeight * 0.75;
      return railTop + (ul.getBoundingClientRect().top - a.getBoundingClientRect().top);
    };

    const update = (now: number) => {
      raf = 0;
      const list = sections();
      const line = window.innerHeight * 0.33;
      let idx = 0;
      list.forEach((s, i) => { if (s.getBoundingClientRect().top <= line) idx = i; });
      if (idx !== current) { current = idx; riseAt = now; }

      const H = window.innerHeight;
      const rest = Math.min(H - 40, restingStart(list));
      const t = reduce ? 1 : Math.min(1, (now - riseAt) / RISE_MS);
      const start = H + (rest - H) * ease(t);          // 화면 아래 → 제자리 높이로 차오름

      for (const s of list) {
        const ul = ulOf(s);
        const fade = s.querySelector<HTMLElement>(":scope > [data-fade]");
        if (!ul || !fade) continue;
        fade.style.top = `${ul.offsetTop - BLEED}px`;
        fade.style.height = `${ul.offsetHeight + BLEED * 2}px`;
        const top = ul.getBoundingClientRect().top - BLEED;
        fade.style.setProperty("--f0", `${start - top}px`);
        fade.style.setProperty("--f1", `${H - top}px`);
      }
      if (t < 1) raf = requestAnimationFrame(update);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(update); };

    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    };
  }, []);
  return null;
}
