import { Experience } from "@/components/Experience";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border focus:border-neon focus:bg-deep focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-neon"
      >
        Skip to content
      </a>
      <Experience />
    </>
  );
}
