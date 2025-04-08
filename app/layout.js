import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RegisterSW from './register-sw';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SplitSmart",
  description: "Split your expenses with your group smartly.",
  manifest: '/manifest.json',
  icons: {
    icon: '/icon512_rounded.png',
    apple: '/icon512_maskable.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
