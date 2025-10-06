import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-2">
        <div className="flex items-center justify-between p-6 border-b border-[rgba(46,46,46,0.12)]">
          <h2 className="text-xl font-semibold text-[#2E2E2E]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-[10px] transition-colors"
          >
            <X className="h-5 w-5 text-[#5A5A5A]" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
