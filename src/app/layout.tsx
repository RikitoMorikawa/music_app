import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClerkProvider
        appearance={{
          layout: {
            unsafe_disableDevelopmentModeWarnings: true,
          },
        }}
      >
        <html lang="en">
          <body className={inter.className}>
            <Navbar />
            <main className="my-8 mx-10 max-w-7xl px-4 sm:px-6 lg:px-8">{children}</main>
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
