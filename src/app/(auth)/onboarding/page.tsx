import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { getAuthenticatedUser, getUserTenantContext } from "@/lib/auth/session";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export default async function OnboardingPage() {
  const auth = await getAuthenticatedUser();

  if (auth.status === "unauthenticated" || auth.status === "unconfigured") {
    redirect("/login?next=%2Fonboarding");
  }
  if (auth.status !== "authenticated") {
    redirect("/auth-error");
  }

  const context = await getUserTenantContext();

  if (context.status === "ready") {
    redirect("/dashboard");
  }
  if (context.status !== "onboarding") {
    redirect("/auth-error");
  }

  const metadataName = auth.user.user_metadata.full_name;
  const initialName = typeof metadataName === "string" ? metadataName : "";

  return (
    <OnboardingForm
      configured={Boolean(getSupabasePublicConfig())}
      initialName={initialName}
    />
  );
}