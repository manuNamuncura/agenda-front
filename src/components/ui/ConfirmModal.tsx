// src/components/ui/ConfirmModal.tsx
import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Overlay con Blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Contenedor del Modal */}
      <div className="relative bg-[#121212] border border-white/10 rounded-4xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-4 text-2xl">
            ⚠️
          </div>
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {message}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            SÍ, ELIMINAR
          </button>
          <button
            onClick={onClose}
            className="w-full bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-4 rounded-2xl transition-all"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
};
