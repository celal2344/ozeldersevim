import { getCurrentAccount } from "@/features/auth/service";
import { AccountProfileForm } from "@/features/profiles/account-profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export async function AccountProfileView() {
  const account = await getCurrentAccount();

  if (!account) return null;

  return (
    <Card>
      <CardHeader>
        <CardDescription>Hesap Bilgileri</CardDescription>
        <CardTitle className="text-xl text-brand-navy">Profil Düzenle</CardTitle>
      </CardHeader>
      <CardContent>
        <AccountProfileForm
          defaultValues={{
            fullName: account.fullName,
            phone: account.phone ?? "",
            email: account.email,
          }}
        />
      </CardContent>
    </Card>
  );
}
