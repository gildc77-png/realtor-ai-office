import { AuthEntry } from "@/components/auth/auth-entry";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <AuthEntry mode="forgot-password" next={params.next} />;
}