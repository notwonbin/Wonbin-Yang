import type { Project } from "@/lib/types";
import Carousel from "./Carousel";
import Secret from "./Secret";
import styles from "./ProjectSection.module.css";
import fadeStyles from "./FocusDim.module.css";

export default function ProjectSection({ project, secrets = [] }: { project: Project; secrets?: { text: string; x: number; y: number }[] }) {
  const { slug, title, year, role, scope, company, description, media } = project;
  return (
    <section id={slug} data-section={slug} className={styles.section} aria-labelledby={`${slug}-title`}>
      <div className={styles.head}>
        <div>
          <h2 id={`${slug}-title`} className={styles.title}>{title}</h2>
          <p className={styles.year}>{year}</p>
        </div>

        <dl className={styles.facts}>
          {/* Role: 직책 + 작업 범위를 한 줄에, 기호 없이 간격으로만 구분 — projects.ts 의 role / scope */}
          <div>
            <dt>Role</dt>
            <dd className={styles.roles}>
              {[role, ...(scope ?? "").split("·")].map((r) => r.trim()).filter(Boolean).map((r) => <span key={r}>{r}</span>)}
            </dd>
          </div>
          <div><dt>Company</dt><dd>{company}</dd></div>
        </dl>

        <p className={styles.description}>{description}</p>
      </div>

      <Carousel media={media} label={title} />
      {/* 화면 아래쪽 카드 흐림 층 — 위치·세기는 FocusDim.tsx */}
      <div data-fade className={fadeStyles.fade} aria-hidden="true"><i /><i /><i /><i /></div>

      {secrets.map((s, i) => (
        <Secret key={i} text={s.text} x={s.x} y={s.y} className={styles.secret} />
      ))}
    </section>
  );
}
