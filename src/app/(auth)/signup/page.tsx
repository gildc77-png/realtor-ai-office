import { AuthEntry } from "@/components/auth/auth-entry";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <AuthEntry mode="signup" next={params.next} />;
}