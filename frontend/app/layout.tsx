import '../styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Gamify Reading',
  description: 'Геймификация чтения для людей с ADHD'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}