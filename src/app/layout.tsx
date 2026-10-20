import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/avr.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ClientThemeWrapper from "@/contexts/CliehtThemeWrapper";
import { ImageNavigationProvider } from "@/contexts/ImageNavigationContext";
import { UserPhotoProvider } from "@/contexts/UserPhotoContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { APP_CONFIG } from "@/constants/app";
import { Analytics } from "@vercel/analytics/react";
import QueryProvider from "@/contexts/ReactQueryContext";
import LayoutVisibility from "@/components/LayoutVisibility";
import { SiteHeader } from "@/components/ds/SiteHeader";
import { SiteFooter } from "@/components/ds/SiteFooter";
import { PageContainer } from "@/components/ds/PageContainer";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`}>
      <head>
        <title>{APP_CONFIG.title}</title>
        <meta name="description" content={APP_CONFIG.description} />
        <link rel="icon" href={APP_CONFIG.avatar} />
      </head>
      <body>
        <QueryProvider>
          <UserPhotoProvider>
            <ThemeProvider>
              <LanguageProvider>
                <ClientThemeWrapper>
                  <ImageNavigationProvider>
                    <div className="avr-shell">
                      <LayoutVisibility hideOn={["/collections/"]}>
                        <SiteHeader />
                        <PageContainer>{children}</PageContainer>
                      </LayoutVisibility>
                      <LayoutVisibility showOnlyOn={["/collections/"]}>
                        {children}
                      </LayoutVisibility>
                      <SiteFooter />
                    </div>
                  </ImageNavigationProvider>
                </ClientThemeWrapper>
              </LanguageProvider>
            </ThemeProvider>
          </UserPhotoProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
