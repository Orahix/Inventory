import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { InventoryList } from './components/InventoryList';
import { StockTransactions } from './components/StockTransactions';
import { StaffManagement } from './components/StaffManagement';
import { TransactionHistory } from './components/TransactionHistory';
import { InventoryItem, StaffMember, Transaction } from './types';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Sample data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Monokristalinični solarni panel 450W',
      category: 'Solarni paneli',
      currentStock: 150,
      minStock: 10,
      maxStock: 500,
      unitPrice: 35000,
      supplier: 'Solar Tech Solutions',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'String inverter 10kW',
      category: 'Inverteri',
      currentStock: 8,
      minStock: 5,
      maxStock: 50,
      unitPrice: 180000,
      supplier: 'Power Electronics',
      createdAt: '2024-01-10',
      project: 'Solarna elektrana Novi Sad',
    },
    {
      id: '3',
      name: 'DC kabl 4mm² crni',
      category: 'Kablovi',
      currentStock: 2000,
      minStock: 500,
      maxStock: 5000,
      unitPrice: 120,
      supplier: 'Cable Systems',
      createdAt: '2024-01-05',
      project: 'Solarna elektrana Beograd',
    },
    {
      id: '4',
      name: 'Junction box IP67',
      category: 'Spojne kutije',
      currentStock: 45,
      minStock: 20,
      maxStock: 200,
      unitPrice: 2500,
      supplier: 'Electrical Components',
      createdAt: '2024-01-12',
    },
    {
      id: '5',
      name: 'DC prekidač 32A',
      category: 'Prekidačka oprema',
      currentStock: 12,
      minStock: 10,
      maxStock: 100,
      unitPrice: 8500,
      supplier: 'Switch & Control',
      createdAt: '2024-01-08',
      project: 'Solarna elektrana Kragujevac',
    },
    {
      id: '6',
      name: 'Aluminijumska šina za montažu',
      category: 'Montažni sistemi',
      currentStock: 300,
      minStock: 100,
      maxStock: 1000,
      unitPrice: 1200,
      supplier: 'Mounting Solutions',
      createdAt: '2024-01-20',
    },
  ]);

  // Get unique suppliers from inventory
  const suppliers = Array.from(new Set(inventory.map(item => item.supplier))).filter(Boolean).sort();
  
  const handleAddSupplier = (supplier: string) => {
    // Supplier will be automatically added to the list when the inventory item is saved
    // since suppliers are derived from inventory items
  };

  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Marko Petrović',
      email: 'marko.petrovic@kompanija.com',
      role: 'Admin',
      department: 'Operacije',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Ana Jovanović',
      email: 'ana.jovanovic@kompanija.com',
      role: 'Manager',
      department: 'Magacin',
      createdAt: '2024-01-08',
    },
    {
      id: '3',
      name: 'Stefan Nikolić',
      email: 'stefan.nikolic@kompanija.com',
      role: 'Staff',
      department: 'Inventar',
      createdAt: '2024-01-12',
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
  ]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddItem = (itemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInventory(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, itemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, ...itemData } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const handleAddStaff = (staffData: Omit<StaffMember, 'id' | 'createdAt'>) => {
    const newStaff: StaffMember = {
      ...staffData,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStaff(prev => [...prev, newStaff]);
  };

  const handleUpdateStaff = (id: string, staffData: Omit<StaffMember, 'id' | 'createdAt'>) => {
    setStaff(prev => prev.map(member => 
      member.id === id ? { ...member, ...staffData } : member
    ));
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(prev => prev.filter(member => member.id !== id));
  };

  const handleTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Update inventory stock
    setInventory(prev => prev.map(item => {
      if (item.id === transactionData.itemId) {
        const newStock = transactionData.type === 'input'
          ? item.currentStock + transactionData.quantity
          : item.currentStock - transactionData.quantity;
        
        return { 
          ...item, 
          currentStock: Math.max(0, newStock),
          project: transactionData.project
        };
      }
      return item;
    }));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard inventory={inventory} transactions={transactions} />;
      case 'inventory':
        return (
          <InventoryList
            inventory={inventory}
            transactions={transactions}
            suppliers={suppliers}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onAddSupplier={handleAddSupplier}
          />
        );
      case 'input':
        return (
          <StockTransactions
            type="input"
            inventory={inventory}
            staff={staff}
            onTransaction={handleTransaction}
          />
        );
      case 'output':
        return (
          <StockTransactions
            type="output"
            inventory={inventory}
            staff={staff}
            onTransaction={handleTransaction}
          />
        );
      case 'staff':
        return (
          <StaffManagement
            staff={staff}
            onAddStaff={handleAddStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        );
      case 'history':
        return <TransactionHistory transactions={transactions} />;
      default:
        return <Dashboard inventory={inventory} transactions={transactions} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <main className="flex-1 p-4 lg:p-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;