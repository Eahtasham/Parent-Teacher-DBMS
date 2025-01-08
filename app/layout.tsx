import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Parent-Teacher Portal',
  description: 'A platform for parent-teacher interaction and meeting scheduling',
  icons: "https://fonts.gstatic.com/icon/font?kit=kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsKTCIoqcX_0kt8iUb8wgw&skey=b8dc2088854b122f&v=v222"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
      {/* <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        > */}
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}