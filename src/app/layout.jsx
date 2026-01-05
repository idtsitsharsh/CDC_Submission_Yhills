import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "YHills Dashboard",
  description: "Admin dashboard for course management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body   className={`${geistSans.className} ${geistMono.className}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
