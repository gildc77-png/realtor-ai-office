import { AuthEntry } from "@/components/auth/auth-entry";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; notice?: string }>;
}) {
  const params = await searchParams;
  return <AuthEntry mode="login" next={params.next} notice={params.notice} />;
}