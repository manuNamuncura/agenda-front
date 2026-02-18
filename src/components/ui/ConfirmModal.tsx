import React from "react";
import {
  type LucideIcon,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "success";
  icon?: LucideIcon;
  showConfirm?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  icon: Icon,
  showConfirm = true,
}) => {
  if (!isOpen) return null;

  // Mapeo de estilos según variante
  const variantStyles = {
    danger: {
      button: "bg-red-500 hover:bg-red-600 shadow-red-500/20",
      iconBg: "bg-red-500/10 text-red-500",
      defaultIcon: AlertTriangle,
    },
    primary: {
      button: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20",
      iconBg: "bg-blue-500/10 text-blue-400",
      defaultIcon: Info,
    },
    success: {
      button: "bg-green-500 hover:bg-green-600 shadow-green-500/20",
      iconBg: "bg-green-500/10 text-green-500",
      defaultIcon: CheckCircle2,
    },
  };

  const style = variantStyles[variant];
  const FinalIcon = Icon || style.defaultIcon; // Si no mandas icono, usa el default de la variante

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="text-center">
          {/* Contenedor del Icono */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${style.iconBg}`}
          >
            <FinalIcon size={32} strokeWidth={2.5} />
          </div>

          <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
            {title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 px-2">
            {message}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Solo mostramos el botón si showConfirm es true */}
          {showConfirm && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`w-full text-black font-black py-4 rounded-2xl transition-all active:scale-95 uppercase tracking-widest text-xs ${style.button}`}
            >
              {confirmText}
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-4 rounded-2xl transition-all text-xs uppercase tracking-widest"
          >
            {/* Si no hay botón de confirmar, quizás quieras que este diga "ENTENDIDO" o "CERRAR" */}
            {!showConfirm ? "ENTENDIDO" : cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
