import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

import { Cabin } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cabin = Cabin({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendWise - Expense Tracker",
  description: "SpendWise is a simple app to track your expenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cabin.className}  antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
