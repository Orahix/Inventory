import React, { useState } from 'react';
import { StaffMember } from '../types';

interface StaffFormProps {
  staff?: StaffMember | null;
  onSubmit: (staff: Omit<StaffMember, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const StaffForm: React.FC<StaffFormProps> = ({ staff, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    email: staff?.email || '',
    role: staff?.role || 'Staff' as 'Admin' | 'Manager' | 'Staff',
    department: staff?.department || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Puno ime *
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
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Uloga *
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
          >
            <option value="Staff">Osoblje</option>
            <option value="Manager">Menadžer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Odeljenje *
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            placeholder="npr. Magacin, Prodaja, IT"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
          />
        </div>
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
          {staff ? 'Ažuriraj' : 'Dodaj'} člana osoblja
        </button>
      </div>
    </form>
  );
};