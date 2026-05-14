import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Toaster } from "react-hot-toast";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
    <html lang="id" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <StoreProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a2332',
                color: '#f0f3f9',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 16px',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
