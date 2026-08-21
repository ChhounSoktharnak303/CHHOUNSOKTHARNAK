"use client";

import { MotionConfig } from "framer-motion";
import { Cursor } from "@/components/ui/Cursor";
import { BootScreen } from "@/components/sections/BootScreen";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Education } from "@/components/sections/Education";
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
      <Cursor />
      <Navbar />
      <div className="noise-overlay" aria-hidden="true" />
      <main id="main">
        <Hero />
        <About />
        <Education />
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
