import "./globals.css";
import { TOCKABLE_METADATA } from "@/constants/metadata";
import { Comfortaa } from "next/font/google";
import Support from "@/app/support";

const c = Comfortaa({ subsets: ["latin"], weight: ["300", "700"] });

export const metadata = TOCKABLE_METADATA;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={c.className}>
      <body className="bg-tock-black">
        {children}
        <Support />
      </body>
    </html>
  );
}
