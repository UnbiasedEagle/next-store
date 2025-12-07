import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/navigation/nav';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Next Store',
  description: 'Modern e-commerce store built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${roboto.variable} font-sans antialiased`}>
        <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}
