import React, { useState } from 'react';
import { X, Plus, Minus, AlertCircle, Loader } from 'lucide-react';
import { useRFQ } from '../contexts/RFQContext';
import { downloadRFQPDF } from '../utils/pdfGenerator';
import { RFQData } from '../types';

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RFQModal: React.FC<RFQModalProps> = ({ isOpen, onClose }) => {
  const { selectedItems, updateQuantity, removeItem } = useRFQ();
  const [supplierName, setSupplierName] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGeneratePDF = async () => {
    setError(null);

    if (!supplierName.trim()) {
      setError('Molimo unesite naziv dobavljaca');
      return;
    }

    if (!supplierAddress.trim()) {
      setError('Molimo unesite adresu dobavljaca');
      return;
    }

    if (!supplierEmail.trim()) {
      setError('Molimo unesite email dobavljaca');
      return;
    }

    if (selectedItems.length === 0) {
      setError('Molimo izaberite bar jedan artikal');
      return;
    }

    try {
      setIsGenerating(true);

      const rfqData: RFQData = {
        supplierName,
        supplierAddress,
        supplierEmail,
        items: selectedItems,
      };

      downloadRFQPDF(rfqData);

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greska pri generisanju PDF-a');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalValue = selectedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[12px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Kreiraj Zahtev za Ponudu</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-300 rounded-[10px] p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Informacije o Dobavljacu</h3>

            <div>
              <label htmlFor="supplier-name" className="block text-sm font-medium text-slate-700 mb-1">
                Naziv Dobavljaca
              </label>
              <input
                id="supplier-name"
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="npr. Distributivna Kuca d.o.o."
                className="w-full px-3 py-2 border border-slate-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="supplier-address" className="block text-sm font-medium text-slate-700 mb-1">
                Adresa
              </label>
              <input
                id="supplier-address"
                type="text"
                value={supplierAddress}
                onChange={(e) => setSupplierAddress(e.target.value)}
                placeholder="npr. Glavna 123, 11000 Beograd"
                className="w-full px-3 py-2 border border-slate-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="supplier-email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="supplier-email"
                type="email"
                value={supplierEmail}
                onChange={(e) => setSupplierEmail(e.target.value)}
                placeholder="npr. info@dobavljac.rs"
                className="w-full px-3 py-2 border border-slate-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Artikli za Nabavku</h3>

            {selectedItems.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-[8px]">
                <p className="text-slate-600">Nema izabranih artikala</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedItems.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-[8px] border border-slate-200">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {index + 1}. {item.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {item.unitPrice.toFixed(2)} RSD x {item.unit}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-[6px]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right min-w-24">
                      <p className="font-semibold text-slate-900">
                        {(item.quantity * item.unitPrice).toFixed(2)} RSD
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-[6px] transition-colors"
                      title="Ukloni artikal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-sm text-slate-600 mb-1">Ukupna vrednost:</p>
                <p className="text-2xl font-bold text-blue-600">{totalValue.toFixed(2)} RSD</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-[8px] text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Otkazi
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating || selectedItems.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-[8px] font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isGenerating && <Loader className="h-4 w-4 animate-spin" />}
              Generisi PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
