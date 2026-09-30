const INTERNAL_ORIGIN = "https://realtor-ai-office.invalid";

export function getSafeReturnPath(
  value: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\r\n]/.test(value)
  ) {
    return fallback;
  }

  try {
    const target = new URL(value, INTERNAL_ORIGIN);

    if (target.origin !== INTERNAL_ORIGIN) {
      return fallback;
    }

    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return fallback;
  }
}