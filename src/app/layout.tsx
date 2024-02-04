import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
