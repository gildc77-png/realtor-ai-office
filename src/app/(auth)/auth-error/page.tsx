import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div>
      <p className="eyebrow">Account access</p>
      <h2 className="auth-title">We couldn’t verify your workspace</h2>
      <p className="auth-description">Your protected workspace is unavailable until your session and organization membership can be verified.</p>
      <div className="auth-links auth-recovery-links">
        <Link className="auth-submit auth-submit-link" href="/login">Return to sign in</Link>
        <Link href="/onboarding">Continue workspace setup</Link>
      </div>
    </div>
  );
}