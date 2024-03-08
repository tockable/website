import "./globals.css";
import { TOCKABLE_METADATA } from "@/constants/metadata";
import { Comfortaa } from "next/font/google";
import News from "./news";

const c = Comfortaa({ subsets: ["latin"], weight: ["300", "700"] });

export const metadata = TOCKABLE_METADATA;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={c.className}>
      <body className="bg-tock-black">
        {children}
        <News />
      </body>
    </html>
  );
}
