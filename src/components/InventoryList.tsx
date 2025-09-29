import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Search, Filter } from 'lucide-react';
import { InventoryItem } from '../types';
import { Modal } from './Modal';
import { InventoryForm } from './InventoryForm';

interface InventoryListProps {
  inventory: InventoryItem[];
  transactions: any[];
  suppliers: string[];
  onAddItem: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  onUpdateItem: (id: string, item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  onDeleteItem: (id: string) => void;
  onAddSupplier: (supplier: string) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  inventory,
  transactions,
  suppliers,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onAddSupplier,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  
  // Get unique projects from transactions
  const projects = Array.from(new Set(transactions.map(t => t.project))).filter(Boolean);

  const filteredInventory = inventory.filter(item =>
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.supplier.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedProject === 'all' || item.project === selectedProject)
  );

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (itemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    if (editingItem) {
      onUpdateItem(editingItem.id, itemData);
    } else {
      onAddItem(itemData);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Upravljanje inventarom</h1>
        <button
          onClick={handleAddItem}
          className="flex items-center px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
        >
          <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
          Dodaj stavku
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pretraži inventar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            >
              <option value="all">Svi projekti</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Naziv</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Kategorija</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Zalihe</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Min/Max</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Cena</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Dobavljač</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 lg:px-4 font-medium text-gray-900 text-sm lg:text-base">
                    <div className="max-w-[150px] lg:max-w-none truncate" title={item.name}>
                      {item.name}
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-gray-600 text-sm lg:text-base">{item.category}</td>
                  <td className="py-3 px-2 lg:px-4">
                    <span className={`px-2 py-1 rounded-full text-xs lg:text-sm ${
                      item.currentStock <= item.minStock
                        ? 'bg-red-100 text-red-800'
                        : item.currentStock >= item.maxStock
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-gray-600 text-sm lg:text-base">{item.minStock}/{item.maxStock}</td>
                  <td className="py-3 px-2 lg:px-4 text-gray-600 text-sm lg:text-base">{item.unitPrice.toFixed(0)} RSD</td>
                  <td className="py-3 px-2 lg:px-4 text-gray-600 text-sm lg:text-base">
                    <div className="max-w-[100px] lg:max-w-none truncate" title={item.supplier}>
                      {item.supplier}
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded text-sm lg:text-base"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded text-sm lg:text-base"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || selectedProject !== 'all' ? 'Nema stavki koje odgovaraju filterima.' : 'Nema pronađenih stavki inventara.'}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Izmeni stavku' : 'Dodaj novu stavku'}
      >
        <InventoryForm
          item={editingItem}
          suppliers={suppliers}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onAddSupplier={onAddSupplier}
        />
      </Modal>
    </div>
  );
};