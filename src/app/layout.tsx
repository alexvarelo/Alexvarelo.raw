import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ClientThemeWrapper from "@/contexts/CliehtThemeWrapper";
import NavbarHeader from "@/components/NavbarHeader";
import Footer from "@/components/Footer";
import { ImageNavigationProvider } from "@/contexts/ImageNavigationContext";
import { UserPhotoProvider } from "@/contexts/UserPhotoContext";
import { APP_CONFIG } from "@/constants/app";
import { Analytics } from "@vercel/analytics/react";
import QueryProvider from "@/contexts/ReactQueryContext";
import LayoutVisibility from "@/components/LayoutVisibility";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>{APP_CONFIG.title}</title>
        <meta name="description" content={APP_CONFIG.description} />
        <link rel="icon" href={APP_CONFIG.avatar} />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <UserPhotoProvider>
            <ThemeProvider>
              <ClientThemeWrapper>
                <ImageNavigationProvider>
                  <LayoutVisibility hideOn={["/collections/"]}>
                    <NavbarHeader />
                    <div className="flex flex-col min-h-screen">
                      <div className="flex-grow container mx-auto p-4">
                        {children}
                      </div>
                    </div>
                    <Footer />
                  </LayoutVisibility>
                  <LayoutVisibility showOnlyOn={["/collections/"]}>
                    {children}
                  </LayoutVisibility>
                </ImageNavigationProvider>
              </ClientThemeWrapper>
            </ThemeProvider>
          </UserPhotoProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
