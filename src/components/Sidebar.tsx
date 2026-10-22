"use client";

import { useEffect, useRef, useState } from "react";
import type { Profile, Project } from "@/lib/types";
import { pad } from "@/lib/format";
import { sidebarSecret } from "@/data/secrets";
import Secret from "./Secret";
import styles from "./Sidebar.module.css";

type Props = { profile: Profile; projects: Project[] };

const v = (i: number) => ({ "--i": i }) as React.CSSProperties;

/**
 * 왼쪽 고정 영역: 이름 / 직함 / 위치, 경력, Works 목록, About.
 * 스크롤 위치에 따라 지금 보고 있는 프로젝트가 진하게 표시됩니다.
 */
export default function Sidebar({ profile, projects }: Props) {
  const [current, setCurrent] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const asideRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // 가장 긴 글자 줄이 끝나는 위치 → --side-text-w (경계 그라데이션이 여기서 시작)
  useEffect(() => {
    const aside = asideRef.current;
    const inner = innerRef.current;
    if (!aside || !inner) return;
    const measure = () => {
      const left = aside.getBoundingClientRect().left;
      let right = 0;
      const tw = document.createTreeWalker(inner, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      for (let n = tw.nextNode(); n; n = tw.nextNode()) {
        if (!n.textContent?.trim()) continue;
        range.selectNodeContents(n);
        for (const r of range.getClientRects()) right = Math.max(right, r.right);
      }
      if (right) aside.style.setProperty("--side-text-w", `${Math.ceil(right - left)}px`);
      // 연락처 값 열을 경력 기간 열과 같은 세로선에 맞춤 (경력 회사명 열 폭)
      // 경력 → Works 간격 = 이름 블록 → 경력 간격 (세 덩어리가 같은 리듬)
      const role = inner.querySelector("header > :last-child");
      const career = inner.querySelector("dl");
      if (role && career) {
        const gap = career.getBoundingClientRect().top - role.getBoundingClientRect().bottom;
        if (gap > 0) aside.style.setProperty("--works-gap", `${Math.round(gap)}px`);
      }
      const dt = inner.querySelector("dl dt");
      if (dt) aside.style.setProperty("--label-w", `${Math.ceil(dt.getBoundingClientRect().width)}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(inner);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-section]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(e.target.getAttribute("data-section"));
        }
      },
      // 화면 위쪽 1/3 지점을 지나는 섹션 = 현재 프로젝트
      { rootMargin: "-33% 0px -66% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const focus = hovered ?? current;

  return (
    <aside ref={asideRef} className={styles.sidebar}>
      <div className={styles.edge} aria-hidden="true" />
      <div ref={innerRef} className={styles.inner}>
        <header className={styles.id}>
          <a href="#top" className={`${styles.name} reveal`}>
            <span style={v(0)}>{profile.name}</span>
          </a>
          <p className="reveal"><span style={v(1)}>{profile.role}</span></p>
        </header>

        {/* 경력: 상단이 첫 카드 상단과 같은 가로선. 회사 열 폭 = 가장 긴 회사명 */}
        <dl className={styles.career} aria-label="Career">
          {profile.career.map((c) => (
            <div key={c.company} className={styles.careerRow}>
              <dt>{c.company}</dt>
              <dd className={styles.careerPeriod}>{c.period}</dd>
            </div>
          ))}
        </dl>

        <nav className={styles.works} aria-label="Selected works">
          <p className={`${styles.label} reveal`}>
            <span style={v(6)}>
              Works
            </span>
          </p>
          <ol className={`${styles.list} ${focus ? styles.hasFocus : ""}`} onMouseLeave={() => setHovered(null)}>
            {projects.map((p, i) => (
              <li key={p.slug} className="reveal">
                <a
                  href={`#${p.slug}`}
                  style={v(7 + i)}
                  className={`${styles.item} ${focus === p.slug ? styles.on : ""}`}
                  aria-current={current === p.slug ? "true" : undefined}
                  onMouseEnter={() => setHovered(p.slug)}
                  onFocus={() => setHovered(p.slug)}
                  onBlur={() => setHovered(null)}
                >
                  <span className={styles.num}>{pad(i)}</span>
                  <span className={styles.text}>
                    {p.title}
                    <span className={styles.kind}>{p.kind ?? p.category}, {p.year}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 연락처: 왼쪽 아래. 경력과 같은 형식 (라벨 | 값) */}
        <div className={styles.contact}>
          {/* 지금 보는 프로젝트의 작은 모션 (있는 프로젝트만). 흰 배경은 multiply 로 배경에 녹음 */}
          <div className={styles.motion} aria-hidden="true">
            {projects.map((p) =>
              p.motion ? (
                <video
                  key={p.slug}
                  ref={(el) => {
                    if (!el) return;
                    if (current === p.slug) el.play().catch(() => {});
                    else el.pause();
                  }}
                  className={`${styles.motionClip} ${current === p.slug ? styles.motionOn : ""}`}
                  src={p.motion}
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              ) : null,
            )}
          </div>
          {/* 연락처 한 줄: 누르면 바로 메일 / LinkedIn / Behance */}
          <nav className={styles.contactRow} aria-label="Contact">
            <a href={`mailto:${profile.email}`} className={styles.contactLink}>Email</a>
            {profile.links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={styles.contactLink}>{l.label}</a>
            ))}
          </nav>
        </div>
      </div>
      <Secret text={sidebarSecret} className={styles.secret} />
    </aside>
  );
}
