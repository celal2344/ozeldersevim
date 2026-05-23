import Link from "next/link";

import { LogoutButton } from "@/features/auth/logout-button";
import { getCurrentAccount } from "@/features/auth/service";
import { panelPathForRole } from "@/features/auth/utils";
import { PublicFooter } from "@/shared/components/public-footer";
import { PublicHeader } from "@/shared/components/public-header";
import { Button } from "@/shared/components/ui/button";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const account = await getCurrentAccount();

  return (
    <>
      <PublicHeader
        actions={
          account ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white sm:inline-flex"
                nativeButton={false}
                render={<Link href={panelPathForRole(account.role)} />}
              >
                Panel
              </Button>
              <LogoutButton className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white" />
            </div>
          ) : undefined
        }
      />
      {children}
      <PublicFooter />
    </>
  );
}
