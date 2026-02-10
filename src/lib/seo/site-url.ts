export function getSiteUrl(): string {
  const explicit = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) {
    return explicit;
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const vercelNormalized = normalizeUrl(vercelUrl);

  if (vercelNormalized) {
    return vercelNormalized;
  }

  return "http://localhost:3000";
}

function normalizeUrl(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;

  return withProtocol.replace(/\/+$/, "");
}
