import type { Metadata } from "next";
import { RefineProvider } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ayyaz.dev Admin",
  description: "Admin dashboard for ayyaz.dev portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RefineProvider>{children}</RefineProvider>
      </body>
    </html>
  );
}
