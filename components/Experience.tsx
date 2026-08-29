"use client";

import { MotionConfig } from "framer-motion";
import { Cursor } from "@/components/ui/Cursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Atmosphere } from "@/components/ui/Atmosphere";
import { BootScreen } from "@/components/sections/BootScreen";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Education } from "@/components/sections/Education";
import { WorkExperience } from "@/components/sections/WorkExperience";
import { Skills } from "@/components/sections/skills/SkillsMatrix";
import { Projects } from "@/components/sections/Projects";
import { GitHubPortal } from "@/components/sections/GitHubPortal";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { NexusAssistant } from "@/components/sections/NexusAssistant";

export function Experience() {
  return (
    <MotionConfig reducedMotion="user">
      <BootScreen />
      <Atmosphere />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <div className="noise-overlay" aria-hidden="true" />
      <main id="main">
        <Hero />
        <About />
        <Education />
        <WorkExperience />
        <Skills />
        <Projects />
        <GitHubPortal />
        <Contact />
      </main>
      <Footer />
      <NexusAssistant />
    </MotionConfig>
  );
}
