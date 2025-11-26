import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SantaScribe - Magical Letters from Santa",
  description: "Create personalized, magical letters from Santa Claus to your children. Bring the wonder of Christmas to life with custom letters from the North Pole!",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Kalam:wght@300;400;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
