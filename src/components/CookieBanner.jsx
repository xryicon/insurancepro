import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function CookieBanner() {
  const [showModal, setShowModal] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    if (!Cookies.get('cookieConsent')) {
      setShowModal(true);
    } else {
      setShowFloatingButton(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookieConsent', 'accepted', { expires: 365, path: '/' });
    setShowModal(false);
    setShowFloatingButton(true);
  };

  const handleReject = () => {
    Cookies.set('cookieConsent', 'rejected', { expires: 365, path: '/' });
    setShowModal(false);
    setShowFloatingButton(true);
  };

  const reopenModal = () => {
    setShowModal(true);
  };

  if (!showModal && !showFloatingButton) return null;

  return (
    <>
      {/* Modal Overlay */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={handleReject}
        >
          <Card
            className="max-w-md w-full bg-slate-900 border-slate-800 p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">We Value Your Privacy</h3>
            <p className="text-slate-400 mb-4">
              We use cookies to ensure basic functionality (e.g., language preference).
              By clicking <strong className="text-white">Accept</strong>, you consent to our use of cookies.
            </p>
            <p className="text-sm mb-6">
              <a href="/privacy-policy" className="text-indigo-400 hover:underline">
                Learn more about our privacy policy
              </a>
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="ghost" onClick={handleReject} className="text-slate-300">
                Reject
              </Button>
              <Button onClick={handleAccept}>
                Accept
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Floating Cookie Button */}
      {showFloatingButton && (
        <button
          onClick={reopenModal}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg z-40 flex items-center justify-center"
        >
          🍪
        </button>
      )}
    </>
  );
}