import { PublicFooter } from "@/shared/components/public-footer";
import { PublicHeader } from "@/shared/components/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      {children}
      <PublicFooter />
    </>
  );
}
