import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export default function PalakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={playfair.className}>{children}</div>;
}
