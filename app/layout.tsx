import './globals.css';
import type { Metadata } from 'next';
import { DM_Serif_Display, DM_Sans } from 'next/font/google';

const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: ['400'] });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: 'Aprende y Previene - Zurich Seguros Ecuador',
  description: 'Aplicación educativa sobre prevención de riesgos para familias ecuatorianas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={dmSans.className}>
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
