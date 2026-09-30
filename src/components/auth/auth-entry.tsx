import { redirect } from "next/navigation";
import { AuthForm, type AuthFormMode } from "@/components/auth/auth-form";
import { getSafeReturnPath } from "@/lib/auth/safe-redirect";
import { getUserTenantContext } from "@/lib/auth/session";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export async function AuthEntry({
  mode,
  next,
  notice,
}: {
  mode: AuthFormMode;
  next?: string;
  notice?: string;
}) {
  const nextPath = getSafeReturnPath(next);
  const context = await getUserTenantContext();

  if (mode === "login" || mode === "signup") {
    if (context.status === "ready") {
      redirect(nextPath);
    }
    if (context.status === "onboarding") {
      redirect("/onboarding");
    }
  }

  const messages: Record<string, string> = {
    "password-updated": "Your password has been updated. Sign in with your new password.",
    "callback-failed": "That sign-in link could not be verified. Request a new one and try again.",
  };
  const initialError = context.status === "unavailable"
    ? "We couldn't verify your existing session. Try again or contact support if the problem continues."
    : undefined;

  return (
    <AuthForm
      mode={mode}
      configured={Boolean(getSupabasePublicConfig())}
      nextPath={nextPath}
      notice={notice ? messages[notice] : undefined}
      initialError={initialError}
    />
  );
}