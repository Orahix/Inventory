import React, { useState } from 'react';
import { InventoryItem } from '../types';

interface InventoryFormProps {
  item?: InventoryItem | null;
  suppliers: string[];
  onSubmit: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  onAddSupplier: (supplier: string) => void;
  isSubmitting?: boolean;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({
  item,
  suppliers,
  onSubmit,
  onCancel,
  onAddSupplier,
  isSubmitting = false
}) => {
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="label-text">
            Naziv stavke *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div>
          <label className="label-text">
            Kategorija *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="input-field"
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
          <label className="label-text">
            Trenutne zalihe
          </label>
          <input
            type="number"
            name="currentStock"
            value={formData.currentStock}
            onChange={handleChange}
            min="0"
            className="input-field"
          />
        </div>

        <div>
          <label className="label-text">
            Jedinična cena (RSD)
          </label>
          <input
            type="number"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="input-field"
          />
        </div>

        <div>
          <label className="label-text">
            Minimalne zalihe
          </label>
          <input
            type="number"
            name="minStock"
            value={formData.minStock}
            onChange={handleChange}
            min="0"
            className="input-field"
          />
        </div>

        <div>
          <label className="label-text">
            Maksimalne zalihe
          </label>
          <input
            type="number"
            name="maxStock"
            value={formData.maxStock}
            onChange={handleChange}
            min="0"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label-text">
          Dobavljač *
        </label>
        {!isCustomSupplier ? (
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
            className="input-field"
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
              className="input-field"
            />
            <button
              type="button"
              onClick={() => {
                setIsCustomSupplier(false);
                setCustomSupplier('');
                setFormData(prev => ({ ...prev, supplier: '' }));
              }}
              className="text-sm link-blue"
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
          disabled={isSubmitting}
          className="btn-secondary"
        >
          Otkaži
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-50"
        >
          {isSubmitting ? 'Čuva se...' : `${item ? 'Ažuriraj' : 'Dodaj'} stavku`}
        </button>
      </div>
    </form>
  );
};
