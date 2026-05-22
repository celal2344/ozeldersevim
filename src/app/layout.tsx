import { rootMetadata } from "@/features/seo/constants";
import { AppProviders } from "@/shared/providers/app-providers";
import { geistMono, geistSans } from "@/shared/styles/constants";
import "./globals.css";

export { rootMetadata as metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
