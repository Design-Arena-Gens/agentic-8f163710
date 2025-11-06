import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Iran GeoJSON Viewer',
  description: 'High-resolution Iran boundary rendered on an interactive map',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
