import {
  Code2,
  Database,
  Server,
  Network,
  Bot,
  Cloud,
  GitBranch,
  Terminal,
  Boxes,
  Braces,
  Zap,
  Brain,
  CircuitBoard,
  Container,
  FileCode2,
  Palette,
  Box,
  User,
  Briefcase,
  FolderGit2,
  Mail,
  Atom,
  Sparkles,
  Award,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Skill {
  name: string;
  icon: LucideIcon;
  color: string;
  category: "frontend" | "backend" | "ai" | "iot" | "devops";
}

export const skills: Skill[] = [
  { name: "HTML", icon: FileCode2, color: "#e34f26", category: "frontend" },
  { name: "CSS", icon: Palette, color: "#1572b6", category: "frontend" },
  { name: "JavaScript", icon: Braces, color: "#f7df1e", category: "frontend" },
  { name: "TypeScript", icon: Code2, color: "#3178c6", category: "frontend" },
  { name: "React", icon: Atom, color: "#61dafb", category: "frontend" },
  { name: "Next.js", icon: Box, color: "#ffffff", category: "frontend" },
  { name: "TailwindCSS", icon: Palette, color: "#38bdf8", category: "frontend" },
  { name: "Three.js", icon: Boxes, color: "#049ef4", category: "frontend" },
  { name: "GSAP", icon: Zap, color: "#88ce02", category: "frontend" },
  { name: "Node.js", icon: Server, color: "#339933", category: "backend" },
  { name: "Express", icon: Server, color: "#ffffff", category: "backend" },
  { name: "PHP", icon: Code2, color: "#777bb4", category: "backend" },
  { name: "Python", icon: Terminal, color: "#3776ab", category: "backend" },
  { name: "Firebase", icon: Cloud, color: "#ffca28", category: "backend" },
  { name: "MongoDB", icon: Database, color: "#47a248", category: "backend" },
  { name: "MySQL", icon: Database, color: "#4479a1", category: "backend" },
  { name: "TensorFlow", icon: Brain, color: "#ff6f00", category: "ai" },
  { name: "Machine Learning", icon: Brain, color: "#e23237", category: "ai" },
  { name: "AI", icon: Bot, color: "#7c3aed", category: "ai" },
  { name: "ESP32", icon: CircuitBoard, color: "#e7352c", category: "iot" },
  { name: "Networking", icon: Network, color: "#00bcd4", category: "iot" },
  { name: "Linux", icon: Terminal, color: "#fcc624", category: "devops" },
  { name: "Docker", icon: Container, color: "#2496ed", category: "devops" },
  { name: "Git", icon: GitBranch, color: "#f05032", category: "devops" },
];

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
}

export const experiences: Experience[] = [
  {
    title: "AI Developer",
    company: "Independent Projects",
    period: "2023 — Present",
    description:
      "Building intelligent systems and machine learning models. Developing AI-powered applications that solve real-world problems.",
    icon: Brain,
    tags: ["Python", "TensorFlow", "Machine Learning", "AI"],
  },
  {
    title: "Full Stack Developer",
    company: "Freelance & Personal Projects",
    period: "2022 — Present",
    description:
      "Creating modern web applications with React, Next.js, and Node.js. Building responsive, performant, and beautiful user interfaces.",
    icon: Code2,
    tags: ["React", "Next.js", "Node.js", "TypeScript"],
  },
  {
    title: "Networking Engineer",
    company: "Network Infrastructure",
    period: "2021 — Present",
    description:
      "Designing and maintaining network infrastructure. Implementing secure and reliable network solutions for various environments.",
    icon: Network,
    tags: ["Networking", "Linux", "Security", "Infrastructure"],
  },
  {
    title: "IoT System Developer",
    company: "Embedded Systems",
    period: "2022 — Present",
    description:
      "Developing Internet of Things solutions using ESP32 and embedded systems. Building smart devices that connect the physical and digital worlds.",
    icon: CircuitBoard,
    tags: ["ESP32", "IoT", "Embedded", "Sensors"],
  },
];

export interface Project {
  title: string;
  description: string;
  image: string;
  tech: string[];
  github: string;
  demo: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "AI-Powered Smart Irrigation System",
    description:
      "An intelligent IoT system that uses machine learning to optimize water usage for agriculture. Monitors soil moisture, weather data, and crop needs in real-time.",
    image: "/projects/irrigation.jpg",
    tech: ["Python", "TensorFlow", "ESP32", "IoT"],
    github: "https://github.com/shamimukasa",
    demo: "https://example.com",
    featured: true,
  },
  {
    title: "Immersive 3D Portfolio",
    description:
      "This award-winning style portfolio with React Three Fiber, GSAP animations, and cinematic transitions. A single-page immersive experience.",
    image: "/projects/portfolio.jpg",
    tech: ["Next.js", "Three.js", "GSAP", "TypeScript"],
    github: "https://github.com/shamimukasa",
    demo: "https://example.com",
    featured: true,
  },
  {
    title: "Machine Learning Analytics Dashboard",
    description:
      "A real-time analytics platform that visualizes machine learning model performance. Features interactive charts, predictions, and automated insights.",
    image: "/projects/analytics.jpg",
    tech: ["React", "Python", "TensorFlow", "Node.js"],
    github: "https://github.com/shamimukasa",
    demo: "https://example.com",
  },
  {
    title: "Smart Home Automation System",
    description:
      "A comprehensive IoT home automation solution with ESP32 controllers, mobile app integration, and voice control capabilities.",
    image: "/projects/smarthome.jpg",
    tech: ["ESP32", "React", "Firebase", "IoT"],
    github: "https://github.com/shamimukasa",
    demo: "https://example.com",
  },
  {
    title: "Network Monitoring Platform",
    description:
      "Enterprise-grade network monitoring and management system with real-time alerts, traffic analysis, and automated reporting.",
    image: "/projects/network.jpg",
    tech: ["Node.js", "React", "Networking", "Linux"],
    github: "https://github.com/shamimukasa",
    demo: "https://example.com",
  },
  {
    title: "AI Chat Assistant",
    description:
      "A sophisticated AI chat assistant with natural language processing, context awareness, and multi-language support.",
    image: "/projects/chatbot.jpg",
    tech: ["Python", "AI", "React", "Node.js"],
    github: "https://github.com/shamimukasa",
    demo: "https://example.com",
  },
];

export interface Certificate {
  title: string;
  issuer: string;
  year: string;
  image: string;
  description: string;
}

export const certificates: Certificate[] = [
  {
    title: "Machine Learning Specialization",
    issuer: "DeepLearning.AI",
    year: "2024",
    image: "/certificates/ml.jpg",
    description:
      "Comprehensive machine learning certification covering supervised learning, neural networks, and deep learning.",
  },
  {
    title: "Full Stack Web Development",
    issuer: "Meta",
    year: "2023",
    image: "/certificates/fullstack.jpg",
    description:
      "Advanced full stack development certification covering React, Node.js, databases, and deployment.",
  },
  {
    title: "Cisco Certified Network Associate",
    issuer: "Cisco",
    year: "2023",
    image: "/certificates/ccna.jpg",
    description:
      "Professional networking certification covering routing, switching, and network security fundamentals.",
  },
  {
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    year: "2024",
    image: "/certificates/aws.jpg",
    description:
      "Cloud computing certification covering AWS services, architecture, and cloud best practices.",
  },
  {
    title: "IoT and Embedded Systems",
    issuer: "Coursera",
    year: "2023",
    image: "/certificates/iot.jpg",
    description:
      "Internet of Things certification covering embedded systems, sensors, and IoT architecture.",
  },
  {
    title: "TensorFlow Developer",
    issuer: "Google",
    year: "2024",
    image: "/certificates/tensorflow.jpg",
    description:
      "TensorFlow certification covering deep learning, neural networks, and model deployment.",
  },
];

export const stats = {
  experience: 5,
  projects: 25,
  certificates: 12,
  clients: 8,
};

export const socialLinks = {
  email: "shamimukasa@gmail.com",
  phone: "+250 788 000 000",
  github: "https://github.com/shamimukasa",
  linkedin: "https://linkedin.com/in/shamimukasa",
  whatsapp: "https://wa.me/250788000000",
};

export const navItems = [
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "contact", label: "Contact", icon: Mail },
];
