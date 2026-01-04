import React, { createContext, useContext, useState } from 'react';
import { InventoryItem, RFQItem } from '../types';

interface RFQContextType {
  selectedItems: RFQItem[];
  addItem: (item: InventoryItem, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearAll: () => void;
  getSelectedCount: () => number;
}

const RFQContext = createContext<RFQContextType | undefined>(undefined);

export const RFQProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<RFQItem[]>([]);

  const addItem = (item: InventoryItem, quantity: number) => {
    setSelectedItems(prev => {
      const existingItem = prev.find(i => i.itemId === item.id);
      if (existingItem) {
        return prev.map(i =>
          i.itemId === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: `rfq-${item.id}-${Date.now()}`,
          itemId: item.id,
          name: item.name,
          unit: item.unit || 'kom',
          quantity,
          unitPrice: item.unitPrice,
        },
      ];
    });
  };

  const removeItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setSelectedItems(prev =>
      prev.map(i => (i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  };

  const clearAll = () => {
    setSelectedItems([]);
  };

  const getSelectedCount = () => selectedItems.length;

  return (
    <RFQContext.Provider value={{ selectedItems, addItem, removeItem, updateQuantity, clearAll, getSelectedCount }}>
      {children}
    </RFQContext.Provider>
  );
};

export const useRFQ = () => {
  const context = useContext(RFQContext);
  if (!context) {
    throw new Error('useRFQ must be used within RFQProvider');
  }
  return context;
};
