"use client";

import { useEffect } from "react";
import { cssPx } from "@/lib/cssPx";

/**
 * 데스크톱 전용 부드러운 스크롤 + 프로젝트 스냅.
 *
 * 하나의 스프링(위치·속도)이 페이지를 계속 움직인다.
 *  - 휠/트랙패드 입력 → 목표 위치(target)만 옮기고, 화면은 스프링으로 부드럽게 따라감
 *  - 입력이 멈추면 → 목표를 가장 알맞은 프로젝트 위치로 바꿈 (속도는 그대로 이어져서 끊김 없음)
 *  - 진행 방향으로 조금(ADVANCE)만 넘겨도 다음 프로젝트로
 *  - 목록(#앵커) 클릭도 같은 스프링
 * 키보드·스크롤바·가로 갤러리 스크롤은 브라우저 기본 동작 그대로 둔다.
 * 태블릿·모바일·'동작 줄이기' 설정에서는 동작하지 않는다 (CSS 기본 스냅).
 */

const STIFFNESS = 120;  // 스프링 강도 — 클수록 빨리 따라붙음
const DAMPING = 19;     // 감쇠 — 작을수록 탄력(≈22가 출렁임 없음)
const IDLE_MS = 90;     // 입력이 이만큼 없으면 스냅 시작
const ADVANCE = 0.18;   // 진행 방향으로 이 비율 이상 넘기면 다음 프로젝트로
const WHEEL_GAIN = 1;   // 휠 한 번에 움직이는 양 배율

export default function ScrollSnap() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1025px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches || reduce.matches) return;

    const root = document.documentElement;
    let x = window.scrollY;      // 현재 위치
    let v = 0;                   // 속도
    let target = x;              // 목표 위치
    let running = false;
    let raf = 0;
    let idle = 0;
    let dir = 0;
    let selfY = x;               // 우리가 마지막으로 스크롤한 값 (외부 스크롤 감지용)

    const maxY = () => root.scrollHeight - window.innerHeight;
    const clamp = (n: number) => Math.max(0, Math.min(maxY(), n));
    const railTop = () => cssPx("--rail-top", 24);

    const stops = () => {
      const list = [...document.querySelectorAll<HTMLElement>("[data-section]")].map((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        return clamp(el.matches(":first-of-type") ? 0 : top - railTop());
      });
      return [...new Set([0, ...list, maxY()].map(Math.round))].sort((a, b) => a - b);
    };

    const tick = (() => {
      let prev = performance.now();
      return (now: number) => {
        const dt = Math.min(0.034, (now - prev) / 1000);
        prev = now;
        const a = -STIFFNESS * (x - target) - DAMPING * v;
        v += a * dt;
        x += v * dt;
        if (Math.abs(x - target) < 0.4 && Math.abs(v) < 2) {
          x = target;
          v = 0;
          running = false;
        }
        selfY = Math.round(x);
        window.scrollTo(0, x);
        if (running) raf = requestAnimationFrame(tick);
        else prev = performance.now();
      };
    })();

    const run = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame((t) => {
        tick(t);
      });
    };

    const snap = () => {
      const s = stops();
      const y = target;
      let prev = s[0];
      let next = s[s.length - 1];
      for (const p of s) {
        if (p <= y) prev = p;
        if (p > y) { next = p; break; }
      }
      const progress = next === prev ? 0 : (y - prev) / (next - prev);
      target =
        dir > 0 ? (progress > ADVANCE ? next : prev)
        : dir < 0 ? (progress < 1 - ADVANCE ? prev : next)
        : (progress < 0.5 ? prev : next);
      run();
    };

    const onWheel = (e: WheelEvent) => {
      // 가로 스크롤(갤러리), Shift+휠, 확대(ctrl) 는 브라우저에 맡김
      if (e.ctrlKey || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const d = e.deltaY * unit * WHEEL_GAIN;
      if (!running) { x = window.scrollY; }
      dir = d > 0 ? 1 : -1;
      target = clamp(target + d);
      run();
      window.clearTimeout(idle);
      idle = window.setTimeout(snap, IDLE_MS);
    };

    // 키보드·스크롤바처럼 우리가 아닌 스크롤이 생기면 상태를 맞추고, 멈추면 스냅
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - selfY) <= 1) return;
      cancelAnimationFrame(raf);
      running = false;
      dir = y > x ? 1 : -1;
      x = target = selfY = y;
      v = 0;
      window.clearTimeout(idle);
      idle = window.setTimeout(snap, IDLE_MS * 2);
    };

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el && id !== "top") return;
      e.preventDefault();
      if (!running) x = window.scrollY;
      target = clamp(el && !el.matches("[data-section]:first-of-type")
        ? Math.round(el.getBoundingClientRect().top + window.scrollY - railTop())
        : 0);
      run();
      history.replaceState(null, "", `#${id}`);
    };

    const onResize = () => {
      x = target = selfY = window.scrollY;
      v = 0;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
