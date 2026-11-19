import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import LoadingScreen from "@/components/loading/LoadingScreen";
import Background from "@/components/background/Background";
import Navigation from "@/components/navigation/Navigation";
import CursorGlow from "@/components/effects/CursorGlow";
import NoiseOverlay from "@/components/effects/NoiseOverlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

/* width/initialScale are Next's defaults; viewportFit: "cover" is what
   unlocks env(safe-area-inset-*) on notched phones, and themeColor keeps the
   browser chrome matching the #050505 background. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "Shami Mukasa | AI & Full Stack Developer",
  description:
    "AI Developer, Full Stack Developer, Networking Engineer, and Machine Learning Enthusiast. Building immersive digital experiences with cutting-edge technology.",
  keywords: [
    "Shami Mukasa",
    "AI Developer",
    "Full Stack Developer",
    "Networking Engineer",
    "Machine Learning",
    "IoT Developer",
    "React",
    "Next.js",
    "Three.js",
  ],
  authors: [{ name: "Shami Mukasa" }],
  openGraph: {
    title: "Shami Mukasa | AI & Full Stack Developer",
    description:
      "AI Developer, Full Stack Developer, Networking Engineer, and Machine Learning Enthusiast.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shami Mukasa | AI & Full Stack Developer",
    description:
      "AI Developer, Full Stack Developer, Networking Engineer, and Machine Learning Enthusiast.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <NoiseOverlay />
        <CursorGlow />
        <LoadingScreen />
        <Background />
        <Navigation />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}