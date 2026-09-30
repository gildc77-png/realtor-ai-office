import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export default async function ResetPasswordPage() {
  const auth = await getAuthenticatedUser();

  if (auth.status !== "authenticated") {
    return (
      <div>
        <p className="eyebrow">Password recovery</p>
        <h2 className="auth-title">Recovery session unavailable</h2>
        <p className="auth-description">This reset link may have expired. Request another email to continue.</p>
        <Link className="auth-submit auth-submit-link" href="/forgot-password">Request a new reset link</Link>
      </div>
    );
  }

  return <AuthForm mode="reset-password" configured={Boolean(getSupabasePublicConfig())} />;
}