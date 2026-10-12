import type { Profile } from "@/lib/types";
import styles from "./Footer.module.css";

const toTitle = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} {toTitle(profile.name)}
    </footer>
  );
}
