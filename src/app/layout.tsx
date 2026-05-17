import type { Metadata } from "next";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Toaster } from "react-hot-toast";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LabTrack — Sistem Peminjaman Alat Laboratorium",
  description: "Sistem peminjaman alat laboratorium Teknik Industri Universitas Sultan Ageng Tirtayasa. Mempermudah peminjaman, monitoring, dan pengelolaan alat laboratorium secara real-time.",
  keywords: ["labtrack", "peminjaman alat", "laboratorium", "teknik industri", "untirta", "inventaris"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${barlowCondensed.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen antialiased">
        <StoreProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0C1829',
                color: '#E8EDF5',
                borderRadius: '10px',
                border: '1px solid rgba(0,201,173,0.15)',
                padding: '12px 16px',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
              },
              success: { iconTheme: { primary: '#00C9AD', secondary: '#060D1A' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
