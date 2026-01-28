import Script from "next/script";
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { FontSizeProvider } from "@/contexts/FontSizeContext";
import { VoiceInputModeProvider } from "@/contexts/VoiceInputModeContext";

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
          <Script
            src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
            strategy="beforeInteractive"
          />
        </head>
        <body className="antialiased min-h-screen flex flex-col">
          <FontSizeProvider>
            <VoiceInputModeProvider>
              <Header />
              {children}
            </VoiceInputModeProvider>
          </FontSizeProvider>
        </body>
      </html>
    </ClerkProvider>

  );
}
