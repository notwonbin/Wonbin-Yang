import Sidebar from "@/components/Sidebar";
import ScrollSnap from "@/components/ScrollSnap";
import Cursor from "@/components/Cursor";
import TabTitle from "@/components/TabTitle";
import AmbientTint from "@/components/AmbientTint";
import ThemeToggle from "@/components/ThemeToggle";
import SectionFocus from "@/components/SectionFocus";
import FocusDim from "@/components/FocusDim";
import ProjectSection from "@/components/ProjectSection";
import Footer from "@/components/Footer";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { secretsFor } from "@/data/secrets";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div id="top" className={`grid ${styles.shell}`}>
      <Sidebar profile={profile} projects={projects} />
      <div className={styles.main}>
        <main>
          {projects.map((project, i) => (
            <ProjectSection key={project.slug} project={project} secrets={secretsFor(i)} />
          ))}
        </main>
        <Footer profile={profile} />
      </div>
      <ScrollSnap />
      <Cursor />
      <TabTitle />
      <AmbientTint />
      <ThemeToggle />
      <SectionFocus />
      <FocusDim />
    </div>
  );
}
