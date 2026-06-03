import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';

const COOKIE_NAME = 'cookieConsent';
const COOKIE_VERSION = '1.2';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState('banner');
  const [settings, setSettings] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const existing = Cookies.get(COOKIE_NAME);

    if (!existing) {
      setVisible(true);
      return;
    }

    try {
      const parsed = JSON.parse(existing);
      if (parsed.version !== COOKIE_VERSION) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setVisible(true);
      setStep('banner');
    };

    document.addEventListener('open-cookie', handler);
    return () => document.removeEventListener('open-cookie', handler);
  }, []);

  const saveConsent = (newSettings) => {
    const payload = {
      ...newSettings,
      version: COOKIE_VERSION,
      timestamp: Date.now(),
    };

    Cookies.set(COOKIE_NAME, JSON.stringify(payload), {
      expires: 365,
      path: '/',
    });

    setVisible(false);
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const saveCustom = () => {
    saveConsent(settings);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999] p-4">
      <Card
        className="max-w-lg w-full bg-slate-900 border-slate-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'banner' && (
          <>
            <h3 className="text-xl font-bold mb-3">
              We use cookies
            </h3>

            <p className="text-slate-400 text-sm mb-4">
              We use necessary cookies to run this website and optional cookies to improve your experience and understand usage.
            </p>

            <p className="text-xs text-slate-500 mb-6">
              You can manage your preferences or withdraw consent at any time. See our{' '}
              <a className="text-indigo-400 underline" href="/privacy-policy">
                Privacy Policy
              </a>.
            </p>

            <div className="flex flex-col gap-2">
              <Button onClick={acceptAll}>Accept all</Button>
              <Button variant="ghost" onClick={rejectAll}>
                Reject all
              </Button>
              <Button variant="ghost" onClick={() => setStep('customize')}>
                Customize
              </Button>
            </div>
          </>
        )}

        {step === 'customize' && (
          <>
            <h3 className="text-xl font-bold mb-3">
              Cookie preferences
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Necessary cookies</span>
                <input type="checkbox" checked disabled />
              </div>

              <div className="flex justify-between">
                <span>Analytics cookies</span>
                <input
                  type="checkbox"
                  checked={settings.analytics}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      analytics: e.target.checked,
                    }))
                  }
                />
              </div>

              <div className="flex justify-between">
                <span>Marketing cookies</span>
                <input
                  type="checkbox"
                  checked={settings.marketing}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      marketing: e.target.checked,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={saveCustom}>Save</Button>
              <Button variant="ghost" onClick={() => setStep('banner')}>
                Back
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}