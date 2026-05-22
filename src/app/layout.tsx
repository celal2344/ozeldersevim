import { rootMetadata } from "@/features/seo/metadata";
import { AppProviders } from "@/shared/providers/app-providers";
import { geistMono, geistSans } from "@/shared/styles/fonts";
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
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
