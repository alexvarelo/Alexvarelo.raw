import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/context/ThemeContext";
import ClientThemeWrapper from "@/components/context/CliehtThemeWrapper";
import NavbarHeader from "@/components/NavbarHeader";
import Footer from "@/components/Footer";
import { ImageNavigationProvider } from "@/contexts/ImageNavigationContext";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Alexvarelo.raw</title>
        <meta name="description" content="My personal photo portfolio" />
        <link rel="icon" href="/ProfileAvatar.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ClientThemeWrapper>
            <ImageNavigationProvider>
              <NavbarHeader />
              <div className="flex flex-col min-h-screen">
                <div className="flex-grow container mx-auto p-4">{children}</div>
              </div>
              <Footer />
            </ImageNavigationProvider>
          </ClientThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
