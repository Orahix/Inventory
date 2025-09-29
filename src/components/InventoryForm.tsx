import React, { useState } from 'react';
import { InventoryItem } from '../types';

interface InventoryFormProps {
  item?: InventoryItem | null;
  suppliers: string[];
  onSubmit: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  onAddSupplier: (supplier: string) => void;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({ item, suppliers, onSubmit, onCancel, onAddSupplier }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || '',
    currentStock: item?.currentStock || 0,
    minStock: item?.minStock || 0,
    maxStock: item?.maxStock || 0,
    unitPrice: item?.unitPrice || 0,
    supplier: item?.supplier || '',
  });
  const [isCustomSupplier, setIsCustomSupplier] = useState(
    item ? !Array.isArray(suppliers) || !suppliers.includes(item.supplier) : false
  );
  const [customSupplier, setCustomSupplier] = useState(
    item && (!Array.isArray(suppliers) || !suppliers.includes(item.supplier)) ? item.supplier : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      supplier: isCustomSupplier ? customSupplier : formData.supplier,
    };
    
    // If using custom supplier, add it to the suppliers list
    if (isCustomSupplier && customSupplier.trim()) {
      onAddSupplier(customSupplier.trim());
    }
    
    onSubmit(finalData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'supplier' && value === 'custom') {
      setIsCustomSupplier(true);
      return;
    }
    if (name === 'supplier') {
      setIsCustomSupplier(false);
    }
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Stock') || name === 'unitPrice' ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Naziv stavke *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategorija *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
          >
            <option value="">Izaberi kategoriju...</option>
            <option value="Solarni paneli">Solarni paneli</option>
            <option value="Inverteri">Inverteri</option>
            <option value="Kablovi">Kablovi</option>
            <option value="Spojne kutije">Spojne kutije</option>
            <option value="Prekidačka oprema">Prekidačka oprema</option>
            <option value="Montažni sistemi">Montažni sistemi</option>
            <option value="Monitoring sistemi">Monitoring sistemi</option>
            <option value="Baterije">Baterije</option>
            <option value="Zaštitna oprema">Zaštitna oprema</option>
            <option value="Alati i pribor">Alati i pribor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trenutne zalihe
          </label>
          <input
            type="number"
            name="currentStock"
            value={formData.currentStock}
            onChange={handleChange}
            min="0"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimalne zalihe
          </label>
          <input
            type="number"
            name="minStock"
            value={formData.minStock}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maksimalne zalihe
          </label>
          <input
            type="number"
            name="maxStock"
            value={formData.maxStock}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dobavljač *
        </label>
        {!isCustomSupplier ? (
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
          >
            <option value="">Izaberi dobavljača...</option>
            {Array.isArray(suppliers) && suppliers.map(supplier => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
            <option value="custom">+ Dodaj novog dobavljača</option>
          </select>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={customSupplier}
              onChange={(e) => setCustomSupplier(e.target.value)}
              placeholder="Unesite naziv novog dobavljača..."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
            <button
              type="button"
              onClick={() => {
                setIsCustomSupplier(false);
                setCustomSupplier('');
                setFormData(prev => ({ ...prev, supplier: '' }));
              }}
              className="text-xs lg:text-sm text-blue-600 hover:text-blue-800"
            >
              ← Nazad na listu dobavljača
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 lg:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm lg:text-base"
        >
          Otkaži
        </button>
        <button
          type="submit"
          className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
        >
          {item ? 'Ažuriraj' : 'Dodaj'} stavku
        </button>
      </div>
    </form>
  );
};