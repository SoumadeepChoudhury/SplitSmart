import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RegisterSW from './register-sw';
import { UserContextProvider } from "@/context/UserContext";
import LoadingScreen from "@/utils/loading/loading";

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <RegisterSW />
        <UserContextProvider>
          <LoadingScreen />
          {children}
        </UserContextProvider>
      </body>
    </html>
  );
}
