import type { Profile } from "@/lib/types";
import styles from "./About.module.css";

const toTitle = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export default function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" data-section="about" className={styles.about} aria-labelledby="about-title">
      <h2 id="about-title" className={styles.heading}>About</h2>

      <dl className={styles.list}>
        <div className={styles.row}>
          <dt>Name</dt>
          <dd>{toTitle(profile.name)}</dd>
        </div>
        <div className={styles.row}>
          <dt>Role</dt>
          <dd>{profile.role.replace("BRAND DESIGNER", "Brand Designer")}</dd>
        </div>
        <div className={styles.row}>
          <dt>Career</dt>
          <dd>
            <ul className={styles.career}>
              {profile.career.map((c) => (
                <li key={c.period + c.company}>
                  <span className={styles.period}>{c.period}</span>
                  <span>{c.company}</span>
                  {c.position && <span className={styles.position}>{c.position}</span>}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div className={styles.row}>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${profile.email}`} className="link-underline">{profile.email}</a>
          </dd>
        </div>
        {profile.links.map((l) => (
          <div key={l.label} className={styles.row}>
            <dt>{l.label}</dt>
            <dd>
              <a href={l.href} target="_blank" rel="noreferrer" className="link-underline">{l.handle}</a>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
