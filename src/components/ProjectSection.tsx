import type { Project } from "@/lib/types";
import Carousel from "./Carousel";
import Secret from "./Secret";
import styles from "./ProjectSection.module.css";
import fadeStyles from "./FocusDim.module.css";

export default function ProjectSection({ project, secrets = [] }: { project: Project; secrets?: { text: string; x: number; y: number }[] }) {
  const { slug, title, year, category, role, company, description, media } = project;
  return (
    <section id={slug} data-section={slug} className={styles.section} aria-labelledby={`${slug}-title`}>
      <div className={styles.head}>
        <div>
          <h2 id={`${slug}-title`} className={styles.title}>{title}</h2>
          <p className={styles.year}>{year}</p>
        </div>

        <dl className={styles.facts}>
          <div><dt>Category</dt><dd>{category}</dd></div>
          <div><dt>Role</dt><dd>{role}</dd></div>
          <div><dt>Company</dt><dd>{company}</dd></div>
        </dl>

        <p className={styles.description}>{description}</p>
      </div>

      <Carousel media={media} label={title} />
      {/* 다음 프로젝트일 때 카드만 아래에서 위로 점점 흐리게 (FocusDim.tsx) */}
      <div className={fadeStyles.fade} data-fade="" aria-hidden="true"><i /><i /><i /><i /></div>

      {secrets.map((s, i) => (
        <Secret key={i} text={s.text} x={s.x} y={s.y} className={styles.secret} />
      ))}
    </section>
  );
}
