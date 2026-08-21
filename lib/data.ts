export const personalData = {
  name: "CHHOUN SOKTHARNAK",
  shortName: "SOKTHARNAK",
  role: "FULL-STACK DEVELOPER",
  roles: [
    "IT SPECIALIST",
    "CYBERSECURITY",
    "NETWORKING",
    "GRAPHIC DESIGN",
  ],
  tagline:
    "Portfolio of Chhoun Soktharnak — Full-Stack Developer, IT Specialist, Cybersecurity and Networking Enthusiast from Cambodia.",
  location: "CAMBODIA",
  birthDate: "January 24, 2001",
  sex: "Male",
  placeOfBirth: "Kompong Spue",
  nationality: "Cambodian",
  maritalStatus: "Single",
  address: [
    "35B&35C Village,",
    "Sangkat Kouk Khleang,",
    "Khan Sensok,",
    "Phnom Penh, Cambodia",
  ],
} as const;

export type SocialLink = {
  id: string;
  label: string;
  handle: string;
  href: string | null;
  action: "link" | "tel" | "copy";
  cta: string;
};

export const socialLinks: SocialLink[] = [
  {
    id: "telegram",
    label: "TELEGRAM",
    handle: "@NAKKKKKKL",
    href: "https://t.me/NAKKKKKKL",
    action: "link",
    cta: "MESSAGE ME",
  },
  {
    id: "facebook",
    label: "FACEBOOK",
    handle: "Chhoun Soktharnak",
    href: "https://www.facebook.com/chhoun.soktharnak/",
    action: "link",
    cta: "VISIT FACEBOOK",
  },
  {
    id: "instagram",
    label: "INSTAGRAM",
    handle: "@at_ke_r",
    href: "https://www.instagram.com/at_ke_r",
    action: "link",
    cta: "VISIT INSTAGRAM",
  },
  {
    id: "wechat",
    label: "WECHAT",
    handle: "wxid_1atj0sg8memv12",
    href: null,
    action: "copy",
    cta: "COPY WECHAT ID",
  },
];

export const githubProfile = {
  username: "ChhounSokthamak303",
  url: "https://github.com/ChhounSokthamak303",
  avatar: "/assets/nak.jpg",
};

export type EducationEntry = {
  period: string;
  startYear: string;
  school: string;
  field: string;
  description: string;
  ongoing?: boolean;
};

export const education: EducationEntry[] = [
  {
    period: "2017 — 2019",
    startYear: "2017",
    school: "KOMPONG SPUE HIGH SCHOOL",
    field: "High School",
    description:
      "Graduated from Kompong Spue High School, building the analytical foundations that later powered a journey into technology.",
  },
  {
    period: "2020 - 2025",
    startYear: "2020",
    school: "BUILD BRIGHT UNIVERSITY",
    field: "Information Technology",
    description:
      "Graduated from Build Bright University with a degree in Information Technology - spanning software engineering, databases, networking and cybersecurity.",
  },
  {
    period: "2025 - PRESENT",
    startYear: "2025",
    school: "BUILD BRIGHT UNIVERSITY",
    field: "Master of Information Technology",
    description:
      "Continuing at Build Bright University on a Master's degree in Information Technology - advancing research-driven depth in software engineering, network security and emerging systems. The signal is still transmitting.",
    ongoing: true,
  },
];

export type SkillItem = {
  name: string;
  meta?: string;
  level?: number;
};

export type SkillCategory = {
  id: string;
  label: string;
  code: string;
  items: SkillItem[];
};

export type ThreatVector = {
  id: string;
  name: string;
  meta: string;
  level: number;
};

export const attackVectors: ThreatVector[] = [
  { id: "V-01", name: "Malware", meta: "EXECUTION PAYLOAD", level: 82 },
  { id: "V-02", name: "Phishing", meta: "SOCIAL DECEPTION", level: 85 },
  { id: "V-03", name: "Ransomware", meta: "ENCRYPTION EXTORTION", level: 80 },
  { id: "V-04", name: "DDoS Attack", meta: "FLOOD / AVAILABILITY", level: 83 },
  { id: "V-05", name: "Social Engineering", meta: "HUMAN LAYER", level: 86 },
  { id: "V-06", name: "Zero Day Exploits", meta: "UNKNOWN CVE", level: 74 },
  { id: "V-07", name: "Man-in-the-Middle", meta: "TRAFFIC INTERCEPT", level: 81 },
  { id: "V-08", name: "SQL Injection", meta: "INJECTION / DB", level: 79 },
  { id: "V-09", name: "DNS Attack", meta: "RESOLUTION POISONING", level: 77 },
  { id: "V-10", name: "IoT Vulnerabilities", meta: "EMBEDDED DEVICES", level: 75 },
];

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    label: "PROGRAMMING LANGUAGES",
    code: "LANG",
    items: [
      { name: "HTML", meta: "MARKUP / SEMANTICS", level: 92 },
      { name: "CSS", meta: "STYLING / LAYOUT", level: 88 },
      { name: "JavaScript", meta: "SCRIPTING / WEB", level: 85 },
      { name: "PHP", meta: "SERVER-SIDE", level: 80 },
      { name: "Python", meta: "GENERAL PURPOSE", level: 78 },
      { name: "Java", meta: "OOP / ENTERPRISE", level: 72 },
      { name: "C++", meta: "SYSTEMS", level: 68 },
      { name: "C#", meta: ".NET ECOSYSTEM", level: 70 },
    ],
  },
  {
    id: "database",
    label: "DATABASE",
    code: "DATA",
    items: [
      { name: "MySQL", meta: "RELATIONAL", level: 86 },
      { name: "Oracle", meta: "ENTERPRISE RDBMS", level: 74 },
      { name: "PostgreSQL", meta: "ADVANCED SQL", level: 78 },
      { name: "SQL / Query Language", meta: "QUERY ENGINEERING", level: 88 },
    ],
  },
  {
    id: "frontend",
    label: "FRONT-END",
    code: "UI",
    items: [
      { name: "Vue.js", meta: "PROGRESSIVE FRAMEWORK", level: 80 },
      { name: "Angular", meta: "PLATFORM", level: 72 },
      { name: "Next.js", meta: "REACT META-FRAMEWORK", level: 84 },
      { name: "ReactJS", meta: "UI LIBRARY", level: 84 },
      { name: "Vite / JSX", meta: "TOOLING / SYNTAX", level: 82 },
    ],
  },
  {
    id: "backend",
    label: "BACK-END",
    code: "API",
    items: [
      { name: "Laravel", meta: "PHP FRAMEWORK", level: 80 },
      { name: "ASP.NET", meta: "MICROSOFT STACK", level: 70 },
      { name: "Django", meta: "PYTHON FRAMEWORK", level: 74 },
      { name: "Flask", meta: "MICRO FRAMEWORK", level: 72 },
      { name: "Spring Boot", meta: "JAVA FRAMEWORK", level: 66 },
    ],
  },
  {
    id: "mobile",
    label: "MOBILE",
    code: "APP",
    items: [
      { name: "Flutter", meta: "CROSS-PLATFORM", level: 78 },
      { name: "React Native", meta: "JS NATIVE", level: 74 },
      { name: "Android Studio", meta: "IDE / ANDROID", level: 76 },
    ],
  },
  {
    id: "cyber",
    label: "CYBERSECURITY & NETWORKING",
    code: "SEC",
    items: [
      { name: "Linux Administration", meta: "OPERATING SYSTEM", level: 80 },
      { name: "CLI", meta: "COMMAND LINE", level: 84 },
      { name: "Network Infrastructure", meta: "DESIGN / OPERATION", level: 78 },
      { name: "Switches", meta: "LAYER 2", level: 76 },
      { name: "Routers", meta: "LAYER 3", level: 76 },
      { name: "Ethernet", meta: "LINK LAYER", level: 82 },
      { name: "Cisco Configuration", meta: "IOS CLI", level: 74 },
      { name: "GNS3", meta: "NETWORK EMULATION", level: 72 },
    ],
  },
  {
    id: "microsoft",
    label: "MICROSOFT OFFICE",
    code: "OFC",
    items: [
      { name: "Word", meta: "DOCUMENTS", level: 90 },
      { name: "Excel", meta: "SPREADSHEETS", level: 86 },
      { name: "PowerPoint", meta: "PRESENTATIONS", level: 88 },
      { name: "Outlook", meta: "COMMUNICATION", level: 84 },
      { name: "Access", meta: "DATABASE TOOLS", level: 76 },
    ],
  },
  {
    id: "design",
    label: "DESIGN & MOTION",
    code: "DSGN",
    items: [
      { name: "Photoshop", meta: "RASTER / PHOTO EDITING", level: 85 },
      { name: "After Effects", meta: "MOTION / VFX", level: 75 },
      { name: "Illustrator", meta: "VECTOR / ILLUSTRATION", level: 82 },
      { name: "Canva", meta: "LAYOUT / BRANDING", level: 90 },
    ],
  },
  {
    id: "hardware",
    label: "HARDWARE / SOFTWARE",
    code: "HW",
    items: [
      { name: "Hardware & Software Components", meta: "ASSEMBLY", level: 84 },
      { name: "Installation", meta: "DEPLOYMENT", level: 86 },
      { name: "Printer", meta: "PERIPHERALS", level: 82 },
      { name: "Troubleshooting", meta: "DIAGNOSTICS", level: 88 },
    ],
  },
];

export type Project = {
  id: string;
  code: string;
  title: string;
  status: string;
  tech: string[];
  description: string;
  href: string | null;
};

export const projects: Project[] = [
  {
    id: "mission-01",
    code: "MISSION 01",
    title: "COMPUTER SHOP SYSTEM",
    status: "COMPLETED",
    tech: ["LARAVEL", "VUE.JS", "MYSQL"],
    description:
      "Full digital deployment for a computer shop — product catalog, inventory tracking and daily sales operations brought online and stabilized.",
    href: null,
  },
  {
    id: "mission-02",
    code: "MISSION 02",
    title: "PHONE SHOP SYSTEM",
    status: "COMPLETED",
    tech: ["REACT", "DJANGO", "POSTGRESQL"],
    description:
      "Retail operation for a phone shop — device listings, stock control and customer transactions managed through a single command console.",
    href: null,
  },
  {
    id: "mission-03",
    code: "MISSION 03",
    title: "SHIRT STOREFRONT",
    status: "COMPLETED",
    tech: ["NEXT.JS", "TAILWIND", "LARAVEL API"],
    description:
      "Fashion commerce mission — a shirt store with collection showcases, size variants and order handling stitched into one clean interface.",
    href: null,
  },
  {
    id: "mission-04",
    code: "MISSION 04",
    title: "VEHICLE SHOWROOM",
    status: "COMPLETED",
    tech: ["LARAVEL", "MYSQL", "TAILWIND"],
    description:
      "Vehicle business deployment — listings, specifications and inquiry channels engineered to drive showroom traffic into the fast lane.",
    href: null,
  },
  {
    id: "mission-05",
    code: "MISSION 05",
    title: "MOVIE STREAMING HUB",
    status: "COMPLETED",
    tech: ["REACT", "TAILWIND", "REST API"],
    description:
      "Entertainment platform operation — a movie browsing hub with search, categories and detail views tuned for a smooth playback experience.",
    href: null,
  },
  {
    id: "mission-06",
    code: "MISSION 06",
    title: "CORPORATE COMPANY SITE",
    status: "COMPLETED",
    tech: ["NEXT.JS", "TAILWIND", "FRAMER MOTION"],
    description:
      "Company-wide web presence — services, profile and contact infrastructure deployed to give the business a professional front line.",
    href: null,
  },
  {
    id: "mission-07",
    code: "MISSION 07",
    title: "CLASSIFIED // PENDING DEPLOYMENT",
    status: "IN DEVELOPMENT",
    tech: ["REACT", "NEXT.JS"],
    description:
      "Mission details are still encrypted. This slot is reserved for the next deployed build.",
    href: null,
  },
  {
    id: "mission-08",
    code: "MISSION 08",
    title: "CLASSIFIED // PENDING DEPLOYMENT",
    status: "STANDBY",
    tech: ["LARAVEL", "MYSQL"],
    description:
      "A reserved mission slot. Project data will be transmitted once clearance is granted.",
    href: null,
  },
  {
    id: "mission-09",
    code: "MISSION 09",
    title: "CLASSIFIED // PENDING DEPLOYMENT",
    status: "STANDBY",
    tech: ["FLUTTER", "FIREBASE"],
    description:
      "A reserved mission slot for a mobile operation. Awaiting final transmission.",
    href: null,
  },
];

export const navLinks = [
  { id: "hero", label: "HOME" },
  { id: "about", label: "IDENTITY" },
  { id: "education", label: "EDUCATION" },
  { id: "skills", label: "MATRIX" },
  { id: "projects", label: "MISSIONS" },
  { id: "github", label: "SOURCE" },
  { id: "contact", label: "CONTACT" },
] as const;

export const bootLines = [
  "LOADING NEURAL NETWORK",
  "LOADING DIGITAL ENVIRONMENT",
  "LOADING TECHNOLOGY MATRIX",
  "LOADING USER PROFILE",
];
