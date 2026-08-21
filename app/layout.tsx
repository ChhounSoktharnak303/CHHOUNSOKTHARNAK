import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://soktharnak.dev"),
  title: {
    default: "CHHOUN SOKTHARNAK | Full-Stack Developer & IT Specialist",
    template: "%s | CHHOUN SOKTHARNAK",
  },
  description:
    "Portfolio of Chhoun Soktharnak — Full-Stack Developer, IT Specialist, Cybersecurity and Networking Enthusiast from Cambodia.",
  keywords: [
    "Chhoun Soktharnak",
    "Full-Stack Developer",
    "IT Specialist",
    "Cybersecurity",
    "Networking",
    "Cambodia developer",
    "Next.js",
    "portfolio",
  ],
  authors: [{ name: "Chhoun Soktharnak" }],
  creator: "Chhoun Soktharnak",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://soktharnak.dev",
    siteName: "CHHOUN SOKTHARNAK — Digital Universe",
    title: "CHHOUN SOKTHARNAK | Full-Stack Developer & IT Specialist",
    description:
      "Enter a digital universe built for one developer. Full-Stack Development, IT, Cybersecurity & Networking from Cambodia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CHHOUN SOKTHARNAK | Full-Stack Developer & IT Specialist",
    description:
      "Full-Stack Developer, IT Specialist, Cybersecurity and Networking Enthusiast from Cambodia.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
