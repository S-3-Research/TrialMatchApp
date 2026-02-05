import Script from "next/script";
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { FontSizeProvider } from "@/contexts/FontSizeContext";
import { VoiceInputModeProvider } from "@/contexts/VoiceInputModeContext";
import { ColorSchemeProvider } from "@/contexts/ColorSchemeContext";
import { ThemeScript } from "@/components/ThemeScript";

export const metadata: Metadata = {
  title: "AgentKit demo",
  description: "Demo of ChatKit with hosted workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/sign-in"
    >
      <html lang="en" className="text-base">
        <head>
          <ThemeScript />
          <Script
            src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
            strategy="beforeInteractive"
          />
        </head>
        <body className="antialiased min-h-screen flex flex-col bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50">
          <ColorSchemeProvider>
            <FontSizeProvider>
              <VoiceInputModeProvider>
                <Header />
                <div className="flex-1 flex flex-col pt-28">
                  {children}
                </div>
              </VoiceInputModeProvider>
            </FontSizeProvider>
          </ColorSchemeProvider>
        </body>
      </html>
    </ClerkProvider>

  );
}
