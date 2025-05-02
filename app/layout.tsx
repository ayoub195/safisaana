import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Safisaana Ltd",
  description: "Quality products and courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <AuthContextProvider>
          <Navigation />
          <Toaster position="top-right" />
        {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
