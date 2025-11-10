import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eisenhower Matrix + AI Blueprint Organizer',
  description: 'Task tracker with scoring and AI blueprint (IR/KCS) tools',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
