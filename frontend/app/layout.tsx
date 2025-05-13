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
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ReactQueryProvider>
          <ThemeProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 container mx-auto py-8">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}