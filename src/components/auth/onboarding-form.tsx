"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function OnboardingForm({ configured, initialName }: { configured: boolean; initialName: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!configured) {
      setError("Workspace setup is unavailable until Supabase is configured.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Workspace setup is unavailable right now. Please try again later.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setPending(true);

    try {
      const { error: onboardingError } = await supabase.rpc("complete_workspace_onboarding", {
        p_full_name: String(formData.get("fullName") ?? "").trim(),
        p_organization_name: String(formData.get("organizationName") ?? "").trim(),
      });

      if (onboardingError) {
        setError("We couldn't set up your workspace. Please try again or contact support.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("We couldn't set up your workspace. Please try again later.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <p className="eyebrow">Workspace setup</p>
      <h2 className="auth-title">Create your workspace</h2>
      <p className="auth-description">Set up your profile and brokerage workspace to continue.</p>
      <form className="auth-form" onSubmit={handleSubmit} aria-busy={pending}>
        <div className="auth-field">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" name="fullName" type="text" autoComplete="name" defaultValue={initialName} minLength={2} maxLength={120} required />
        </div>
        <div className="auth-field">
          <label htmlFor="organizationName">Organization / brokerage name</label>
          <input id="organizationName" name="organizationName" type="text" autoComplete="organization" minLength={2} maxLength={120} required />
        </div>
        {error && <p className="auth-message auth-error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit" disabled={pending || !configured}>
          {pending ? "Creating workspace…" : "Create workspace"}
        </button>
      </form>
    </div>
  );
}