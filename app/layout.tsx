import type { Metadata } from "next";
import { Aboreto, Work_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import SmoothScroll from "@/components/smooth-scroll";
import Footer from "@/components/footer";
import Loader from "@/components/Loader/Loader";

const aboreto = Aboreto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-aboreto",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Architect Shahbaz Ahmed",
    default: "Architect Shahbaz Ahmed | Luxury Architecture & Design",
  },
  description:
    "The premier studio of Architect Shahbaz Ahmed. We specialize in bespoke luxury architecture, visionary interior design, expert liaisoning & legal compliance, and meticulous project management consultancy.",
  keywords: [
    "Architect Shahbaz Ahmed",
    "Luxury Architecture",
    "Interior Design",
    "Liaisoning and Legal Compliance",
    "Project Management Consultancy",
    "High-end Residential Architect",
    "Commercial Space Design",
  ],
  authors: [{ name: "Architect Shahbaz Ahmed" }],
  creator: "Architect Shahbaz Ahmed",
  
  // OpenGraph ensures your links look incredible when shared on WhatsApp, LinkedIn, or iMessage
  openGraph: {
    type: "website",
    locale: "en_IN", // Assuming India based on previous location mentions, adjust if needed
    url: "https://www.architectshahbazahmed.com", // Replace with your actual domain
    title: "Architect Shahbaz Ahmed | Luxury Architecture & Design",
    description:
      "Specializing in bespoke luxury architecture, visionary interior design, expert liaisoning, and project management consultancy.",
    siteName: "Architect Shahbaz Ahmed",
    // Make sure to add a beautiful hero image named 'opengraph-image.jpg' in your app folder later!
  },

  // This links the favicon files you dropped into the public folder earlier
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${aboreto.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Loader />
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}