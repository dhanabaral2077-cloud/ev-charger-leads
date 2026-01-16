import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EV Charger Installation | Find Local Electricians & Get Free Quotes",
  description: "Find licensed electricians for EV charger installation in your city. Compare costs, discover rebates, and get free quotes from local installers.",
  keywords: "EV charger installation, electric vehicle charger, home EV charging, Level 2 charger, EV installer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
