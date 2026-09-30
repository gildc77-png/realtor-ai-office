import { redirect } from "next/navigation";
import { getUserTenantContext } from "@/lib/auth/session";

export default async function Home() {
  const context = await getUserTenantContext();

  if (context.status === "ready") {
    redirect("/dashboard");
  }
  if (context.status === "onboarding") {
    redirect("/onboarding");
  }
  if (context.status === "unavailable") {
    redirect("/auth-error");
  }

  if (context.status === "unauthenticated" || context.status === "unconfigured") {
    redirect("/login");
  }

  redirect("/dashboard");
}
