import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

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

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: showModal ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalStyle = {
    background: '#fff',
    padding: '24px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '20px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    border: 'none',
  };

  const acceptButtonStyle = {
    ...buttonStyle,
    background: '#0066cc',
    color: '#fff',
  };

  const rejectButtonStyle = {
    ...buttonStyle,
    background: '#f0f0f0',
    color: '#333',
    border: '1px solid #ccc',
  };

  const floatingButtonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: '#0066cc',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: showFloatingButton ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 999,
    fontSize: '20px',
  };

  return (
    <>
      <div style={modalOverlayStyle} onClick={handleReject}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ margin: 0, color: '#333' }}>We Value Your Privacy</h3>
          <p style={{ margin: '16px 0', color: '#555' }}>
            We use cookies to ensure basic functionality (e.g., language preference).
            By clicking <strong>Accept</strong>, you consent to our use of cookies.
          </p>
          <p style={{ margin: '16px 0', fontSize: '14px' }}>
            <a href="/privacy-policy" style={{ color: '#0066cc' }}>Learn more about our privacy policy</a>
          </p>
          <div style={buttonContainerStyle}>
            <button onClick={handleReject} style={rejectButtonStyle}>Reject</button>
            <button onClick={handleAccept} style={acceptButtonStyle}>Accept</button>
          </div>
        </div>
      </div>

      <button style={floatingButtonStyle} onClick={reopenModal}>
        🍪
      </button>
    </>
  );
}
