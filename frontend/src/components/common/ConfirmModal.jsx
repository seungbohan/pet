import { useState } from 'react';

/**
 * Reusable confirm modal that replaces native confirm() dialogs.
 *
 * Usage:
 *   const [confirmState, setConfirmState] = useState({ open: false });
 *   const showConfirm = (message, onConfirm) =>
 *     setConfirmState({ open: true, message, onConfirm });
 *
 *   <ConfirmModal
 *     open={confirmState.open}
 *     message={confirmState.message}
 *     onConfirm={() => { confirmState.onConfirm?.(); setConfirmState({ open: false }); }}
 *     onCancel={() => setConfirmState({ open: false })}
 *   />
 */
export default function ConfirmModal({
  open,
  title = '확인',
  message = '계속하시겠습니까?',
  confirmText = '확인',
  cancelText = '취소',
  variant = 'danger', // 'danger' | 'default'
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const confirmBtnClass =
    variant === 'danger'
      ? 'bg-red-500 text-white hover:bg-red-600'
      : 'bg-pet-orange text-white hover:bg-pet-orange/90';

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 modal-backdrop"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Icon */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-yellow-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-pet-dark-brown text-center mb-2">{title}</h3>
        <p className="text-sm text-pet-brown/60 text-center mb-6 whitespace-pre-line">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-pet-gray text-pet-brown rounded-xl font-medium hover:bg-pet-peach transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${confirmBtnClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
