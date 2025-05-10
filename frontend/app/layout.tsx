import '../styles/globals.css';
import { ReactNode } from 'react';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';

export const metadata = { title: 'StoryReadr', description: '…' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}