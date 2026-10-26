"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

export type Theme = "light" | "dark";
const KEY = "theme";

/** 지금 테마 (html 의 data-theme). 다른 곳에서 바뀌어도 따라감 */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.dataset.theme === "dark" ? "dark" : "light");
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return theme;
}

/**
 * 화면 오른쪽 위 밝은/어두운 전환 아이콘 (반쯤 채운 원).
 * 선택은 이 브라우저에 기억됨 — layout.tsx 의 스크립트가 첫 화면부터 적용
 */
export default function ThemeToggle() {
  const theme = useTheme();
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className={styles.toggle}
      data-theme-icon={theme}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem(KEY, next); } catch {}
      }}
      aria-label={next === "dark" ? "Dark mode" : "Light mode"}
      title={next === "dark" ? "Dark mode" : "Light mode"}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <circle cx="8" cy="8" r="6.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 1.25a6.75 6.75 0 0 1 0 13.5z" fill="currentColor" />
      </svg>
    </button>
  );
}
