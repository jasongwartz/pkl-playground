import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "bulma/css/bulma.min.css";

export const metadata: Metadata = {
  title: "Pkl Playground",
  description: "A playground for evaluating Pkl code, by the Pkl community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
