import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Multiverso Literário",
  description: "O universo das discussões literárias em áudio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${outfit.variable} font-sans antialiased min-h-screen cosmic-bg text-foreground selection:bg-primary/30 selection:text-primary-foreground`}
      >
        <div className="stars-overlay" />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>

        {/* Camadas de profundidade e brilho (Nebulosas) */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,_oklch(0.55_0.25_280_/_15%),_transparent_50%)] pointer-events-none z-0" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_70%,_oklch(0.45_0.2_220_/_10%),_transparent_50%)] pointer-events-none z-0" />
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      </body>
    </html>
  );
}
