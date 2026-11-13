export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'United States Today';

export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'unitedstatestoday.com';

export const SITE_SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'help@unitedstatestoday.com';

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  return 'https://united-states-today.vercel.app';
}
