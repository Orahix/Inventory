import React, { useState } from 'react';
import { InventoryItem, Transaction, StaffMember } from '../types';

interface StockTransactionsProps {
  type: 'input' | 'output';
  inventory: InventoryItem[];
  staff: StaffMember[];
  onTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

export const StockTransactions: React.FC<StockTransactionsProps> = ({
  type,
  inventory,
  staff,
  onTransaction,
}) => {
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 0,
    unitPrice: 0,
    project: '',
    staffId: '',
    comment: '',
  });

  const selectedItem = inventory.find(item => item.id === formData.itemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !formData.staffId) return;

    const selectedStaff = staff.find(s => s.id === formData.staffId);
    if (!selectedStaff) return;

    const transaction: Omit<Transaction, 'id' | 'date'> = {
      itemId: formData.itemId,
      itemName: selectedItem.name,
      type,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice || selectedItem.unitPrice,
      totalValue: formData.quantity * (formData.unitPrice || selectedItem.unitPrice),
      project: formData.project,
      staffId: formData.staffId,
      staffName: selectedStaff.name,
      comment: formData.comment,
    };

    onTransaction(transaction);
    setFormData({
      itemId: '',
      quantity: 0,
      unitPrice: 0,
      project: '',
      staffId: '',
      comment: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value,
    }));
  };

  const title = type === 'input' ? 'Ulaz robe' : 'Izlaz robe';
  const buttonColor = type === 'input' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{title}</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Izaberi stavku *
              </label>
              <select
                name="itemId"
                value={formData.itemId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              >
                <option value="">Izaberi stavku...</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} (Trenutno: {item.currentStock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Član osoblja *
              </label>
              <select
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              >
                <option value="">Izaberi osoblje...</option>
                {staff.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Količina *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jedinična cena (RSD)
              </label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder={selectedItem ? `Podrazumevano: $${selectedItem.unitPrice}` : ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Naziv projekta *
            </label>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleChange}
              required
              placeholder="Unesite naziv projekta..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Komentar
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={3}
              placeholder="Dodajte komentar o transakciji..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base resize-none"
            />
          </div>

          {selectedItem && formData.quantity > 0 && (
            <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
              <h4 className="text-sm lg:text-base font-medium text-gray-800 mb-2">Pregled transakcije</h4>
              <div className="space-y-1 text-xs lg:text-sm">
                <p>Stavka: <span className="font-medium">{selectedItem.name}</span></p>
                <p>Trenutne zalihe: <span className="font-medium">{selectedItem.currentStock}</span></p>
                <p>Količina transakcije: <span className="font-medium">{formData.quantity}</span></p>
                <p>Novi nivo zaliha: <span className={`font-medium ${
                  type === 'input' 
                    ? 'text-green-600' 
                    : selectedItem.currentStock - formData.quantity < 0 
                      ? 'text-red-600' 
                      : 'text-gray-800'
                }`}>
                  {type === 'input' 
                    ? selectedItem.currentStock + formData.quantity
                    : selectedItem.currentStock - formData.quantity
                  }
                </span></p>
                <p>Ukupna vrednost: <span className="font-medium">
                  {(formData.quantity * (formData.unitPrice || selectedItem.unitPrice)).toFixed(2)} RSD
                </span></p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!formData.itemId || !formData.staffId || formData.quantity <= 0 || !formData.project.trim()}
              className={`px-4 lg:px-6 py-2 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm lg:text-base ${buttonColor}`}
            >
              Obradi {title.toLowerCase()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};