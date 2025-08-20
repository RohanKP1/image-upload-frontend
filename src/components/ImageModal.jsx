import React, { useEffect, useRef } from 'react';

const ImageModal = ({ imageUrl, onClose }) => {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  // Trap focus inside modal
  useEffect(() => {
    if (!imageUrl) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      // Trap tab
      if (e.key === 'Tab') {
        const focusableEls = modalRef.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    // Focus close button on open
    closeBtnRef.current && closeBtnRef.current.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      ref={modalRef}
      tabIndex={-1}
    >
      <div className="relative w-full max-w-4xl max-h-full flex flex-col items-center">
        {/* Improved Close Button */}
        <button
          onClick={onClose}
          ref={closeBtnRef}
          className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-colors duration-200 cursor-pointer"
          aria-label="Close image preview"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img
          src={imageUrl}
          alt="Full-size uploaded preview"
          className="max-w-full max-h-[80vh] sm:max-h-[90vh] rounded-lg shadow-xl object-contain"
        />
      </div>
    </div>
  );
};

export default ImageModal;
