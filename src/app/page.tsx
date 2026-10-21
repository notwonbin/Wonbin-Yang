import Sidebar from "@/components/Sidebar";
import ScrollSnap from "@/components/ScrollSnap";
import Cursor from "@/components/Cursor";
import TabTitle from "@/components/TabTitle";
import FocusDim from "@/components/FocusDim";
import AmbientTint from "@/components/AmbientTint";
import ProjectSection from "@/components/ProjectSection";
import About from "@/components/About";
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
          <About profile={profile} />
        </main>
        <Footer profile={profile} />
      </div>
      <ScrollSnap />
      <Cursor />
      <TabTitle />
      <FocusDim />
      <AmbientTint />
    </div>
  );
}
