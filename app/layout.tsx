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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
