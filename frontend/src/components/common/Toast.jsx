import { useEffect, useState } from 'react';
import useToastStore from '../../store/toastStore';

/* ------------------------------------------------------------------ */
/*  Icon components per toast type                                     */
/* ------------------------------------------------------------------ */
function SuccessIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const icons = { success: SuccessIcon, error: ErrorIcon, warning: WarningIcon, info: InfoIcon };

/* ------------------------------------------------------------------ */
/*  Color map — uses project's pet-themed palette where appropriate    */
/* ------------------------------------------------------------------ */
const colorMap = {
  success: 'bg-green-50 border-green-300 text-green-800',
  error:   'bg-red-50 border-red-300 text-red-800',
  warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
  info:    'bg-blue-50 border-blue-300 text-blue-800',
};

/* ------------------------------------------------------------------ */
/*  Single Toast item with enter / exit animation                      */
/* ------------------------------------------------------------------ */
function ToastItem({ toast }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation on next frame
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => removeToast(toast.id), 200);
  };

  const Icon = icons[toast.type] || icons.info;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-start gap-3 w-full max-w-sm px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm
        transition-all duration-200 ease-out
        ${colorMap[toast.type] || colorMap.info}
        ${visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0'
        }
      `}
    >
      <Icon />
      <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-0.5 rounded-md hover:bg-black/5 transition-colors"
        aria-label="닫기"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toast container — mount once in App.jsx                            */
/* ------------------------------------------------------------------ */
export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto z-[9999] flex flex-col items-center md:items-end gap-2 pointer-events-none"
      aria-label="알림"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full md:w-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
