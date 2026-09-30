"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function signOut() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Session service is unavailable. Please try again.");
      return;
    }

    setPending(true);
    setError("");
    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError("We couldn't sign you out. Please try again.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("We couldn't sign you out. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button className="action-button" type="button" onClick={signOut} disabled={pending}>
        {pending ? "Signing out…" : "Sign out"}
      </button>
      {error && <p className="auth-message auth-error" role="alert">{error}</p>}
    </div>
  );
}