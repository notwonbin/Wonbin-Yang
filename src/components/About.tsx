import type { Profile } from "@/lib/types";
import styles from "./About.module.css";

export default function About({ profile }: { profile: Profile }) {
  return (
    <section id="contact" data-section="contact" className={styles.about} aria-labelledby="contact-title">
      <h2 id="contact-title" className={styles.heading}>Contact</h2>

      <dl className={styles.list}>
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
