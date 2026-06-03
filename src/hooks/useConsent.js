import Cookies from 'js-cookie';

const COOKIE_NAME = 'cookieConsent';

export function useConsent() {
  const raw = Cookies.get(COOKIE_NAME);

  if (!raw) {
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      hasConsent: false,
    };
  }

  try {
    const parsed = JSON.parse(raw);

    return {
      ...parsed,
      hasConsent: true,
    };
  } catch {
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      hasConsent: false,
    };
  }
}