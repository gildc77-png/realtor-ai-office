"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type AuthFormMode = "login" | "signup" | "forgot-password" | "reset-password";

type AuthFormProps = {
  mode: AuthFormMode;
  configured: boolean;
  nextPath?: string;
  notice?: string;
  initialError?: string;
};

const titles: Record<AuthFormMode, string> = {
  login: "Welcome back",
  signup: "Create your account",
  "forgot-password": "Reset your password",
  "reset-password": "Choose a new password",
};

function getAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "That email and password combination was not recognized.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Confirm your email address before signing in.";
  }
  if (normalized.includes("password should be at least")) {
    return "Choose a longer password to meet the account security requirements.";
  }
  if (normalized.includes("session") || normalized.includes("auth session missing")) {
    return "This recovery link has expired. Request a new password reset email.";
  }

  return "We couldn't complete that request. Check your details and try again.";
}

export function AuthForm({ mode, configured, nextPath = "/dashboard", notice, initialError }: AuthFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [message, setMessage] = useState(notice ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!configured) {
      setError("Authentication is not configured. Add the Supabase project URL and public anon key to the local environment.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Authentication is not available right now. Try again later.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setPending(true);

    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
          setError(getAuthErrorMessage(signInError.message));
          return;
        }

        router.replace(nextPath);
        router.refresh();
        return;
      }

      if (mode === "signup") {
        const fullName = String(formData.get("fullName") ?? "").trim();
        const emailRedirectTo = new URL("/auth/callback?next=%2Fonboarding", window.location.origin).toString();
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName }, emailRedirectTo },
        });

        if (signUpError) {
          setError(getAuthErrorMessage(signUpError.message));
          return;
        }

        if (data.session) {
          router.replace("/onboarding");
          router.refresh();
          return;
        }

        setMessage("Check your email for a confirmation link to continue setting up your account.");
        return;
      }

      if (mode === "forgot-password") {
        const redirectTo = new URL("/auth/callback?next=%2Freset-password", window.location.origin).toString();
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

        if (resetError) {
          setError("We couldn't process that request right now. Please try again later.");
          return;
        }

        setMessage("If an account matches that address, password reset instructions will arrive by email.");
        return;
      }

      const confirmation = String(formData.get("confirmPassword") ?? "");

      if (password !== confirmation) {
        setError("The passwords do not match.");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(getAuthErrorMessage(updateError.message));
        return;
      }

      router.replace("/login?notice=password-updated");
      router.refresh();
    } catch {
      setError("Authentication is temporarily unavailable. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const needsPassword = mode === "login" || mode === "signup" || mode === "reset-password";

  return (
    <div>
      <p className="eyebrow">Realtor AI Office</p>
      <h2 className="auth-title">{titles[mode]}</h2>
      <p className="auth-description">
        {mode === "login" && "Sign in to continue to your workspace."}
        {mode === "signup" && "Create an account to start your workspace."}
        {mode === "forgot-password" && "Enter your email and we’ll send reset instructions if an account matches."}
        {mode === "reset-password" && "Choose a new password for your account."}
      </p>

      {!configured && (
        <p className="auth-message auth-error" role="status">
          Authentication is not configured. Add the Supabase project URL and public anon key to the local environment.
        </p>
      )}

      <form className="auth-form" onSubmit={handleSubmit} aria-busy={pending}>
        {mode === "signup" && (
          <div className="auth-field">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" type="text" autoComplete="name" minLength={2} maxLength={120} required />
          </div>
        )}
        {mode !== "reset-password" && (
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
        )}
        {needsPassword && (
          <div className="auth-field">
            <label htmlFor="password">{mode === "reset-password" ? "New password" : "Password"}</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </div>
        )}
        {mode === "reset-password" && (
          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
          </div>
        )}

        {error && <p className="auth-message auth-error" role="alert">{error}</p>}
        {message && <p className="auth-message auth-notice" role="status">{message}</p>}

        <button className="auth-submit" type="submit" disabled={pending || !configured}>
          {pending ? "Please wait…" : titles[mode]}
        </button>
      </form>

      <nav className="auth-links" aria-label="Account links">
        {mode === "login" && (
          <>
            <Link href={`/forgot-password?next=${encodeURIComponent(nextPath)}`}>Forgot password?</Link>
            <span>New to Realtor AI Office? <Link href={`/signup?next=${encodeURIComponent(nextPath)}`}>Create an account</Link></span>
          </>
        )}
        {mode === "signup" && <span>Already have an account? <Link href={`/login?next=${encodeURIComponent(nextPath)}`}>Sign in</Link></span>}
        {mode === "forgot-password" && <Link href={`/login?next=${encodeURIComponent(nextPath)}`}>Return to sign in</Link>}
        {mode === "reset-password" && <Link href="/login">Return to sign in</Link>}
      </nav>
    </div>
  );
}