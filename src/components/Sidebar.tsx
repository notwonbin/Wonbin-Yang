"use client";

import { useEffect, useState } from "react";
import type { Profile, Project } from "@/lib/types";
import { pad } from "@/lib/format";
import { sidebarSecret } from "@/data/secrets";
import Scramble from "./Scramble";
import SeoulTime from "./SeoulTime";
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
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <header className={styles.id}>
          <a href="#top" className={`${styles.name} reveal`}>
            <span style={v(0)}><Scramble text={profile.name} /></span>
          </a>
          <p className="reveal"><span style={v(1)}>{profile.role}</span></p>
          <p className={`${styles.muted} reveal`}><span style={v(2)}>{profile.location}<SeoulTime /></span></p>
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

        <a
          href="#about"
          className={`${styles.about} ${current === "about" ? styles.aboutOn : ""}`}
        >
          About
        </a>
      </div>
      <Secret text={sidebarSecret} className={styles.secret} />
    </aside>
  );
}
