import '../styles/globals.css';
import { ReactNode } from 'react';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import ThemeProvider from '@/components/ThemeProvider';
import { Header } from '@/components/Header';

export const metadata = {
  title: 'StoryReadr',
  description: 'Геймифицированное чтение для продуктивности'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <ReactQueryProvider>
          <ThemeProvider>
            <Header />
            <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
              {children}
            </main>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}