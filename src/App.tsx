import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useInventory } from './hooks/useInventory';
import { useStaff } from './hooks/useStaff';
import { useTransactions } from './hooks/useTransactions';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { InventoryList } from './components/InventoryList';
import { StockTransactions } from './components/StockTransactions';
import { StaffManagement } from './components/StaffManagement';
import { TransactionHistory } from './components/TransactionHistory';
import { Clients } from './components/Clients';
import { InventoryItem, StaffMember, Transaction } from './types';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Authentication
  const { user, userProfile, loading: authLoading, error: authError, signIn, signOut, isAdmin } = useAuth();
  
  // Use database hooks
  const { items: inventory, loading: inventoryLoading, error: inventoryError, addItem, updateItem, deleteItem } = useInventory();
  const { staff, loading: staffLoading, error: staffError, addStaff, updateStaff, deleteStaff } = useStaff();
  const { transactions, loading: transactionsLoading, error: transactionsError, addTransaction } = useTransactions();
  
  // Show login form if not authenticated
  if (authLoading) {
    console.log('App: Showing loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavanje autentifikacije...</p>
          <p className="text-xs text-gray-500 mt-2">Molimo sačekajte...</p>
        </div>
      </div>
    );
  }

  // Show error if authentication failed
  if (authError && !user) {
    console.log('App: Showing auth error', authError);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Greška autentifikacije</h2>
          <p className="text-gray-600 mb-4">{authError}</p>
          <div className="text-xs text-gray-500 mb-4">
            <p>Proverite da li je Supabase konfigurisan ispravno.</p>
            <p>Otvorite Developer Tools (F12) za više detalja.</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
          >
            Pokušaj ponovo
          </button>
          <button
            onClick={() => {
              console.log('Environment variables:');
              console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
              console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Debug Info
          </button>
        </div>
      </div>
    );
  }

  console.log('App: Auth state', { user: !!user, userProfile: !!userProfile });

  if (!user || !userProfile) {
    console.log('App: Showing login form');
    return <LoginForm onLogin={signIn} loading={authLoading} error={authError} />;
  }

  // Show loading state
  if (inventoryLoading || staffLoading || transactionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory system...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (inventoryError || staffError || transactionsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Database Connection Error</h2>
          <p className="text-gray-600 mb-4">
            {inventoryError || staffError || transactionsError}
          </p>
          <p className="text-sm text-gray-500">
            Please make sure your Supabase database is set up correctly and the migration has been run.
          </p>
        </div>
      </div>
    );
  }

  // Get unique suppliers from inventory
  const suppliers = Array.from(new Set(inventory.map(item => item.supplier))).filter(Boolean).sort();
  
  const handleAddSupplier = (supplier: string) => {
    // Supplier will be automatically added to the list when the inventory item is saved
    // since suppliers are derived from inventory items
  };

  const handleAddItem = (itemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    return addItem(itemData);
  };

  const handleUpdateItem = (id: string, itemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    return updateItem(id, itemData);
  };

  const handleDeleteItem = (id: string) => {
    return deleteItem(id);
  };

  const handleAddStaff = (staffData: Omit<StaffMember, 'id' | 'createdAt'>) => {
    return addStaff(staffData);
  };

  const handleUpdateStaff = (id: string, staffData: Omit<StaffMember, 'id' | 'createdAt'>) => {
    return updateStaff(id, staffData);
  };

  const handleDeleteStaff = (id: string) => {
    return deleteStaff(id);
  };

  const handleTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    return addTransaction(transactionData);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard inventory={inventory} transactions={transactions} />;
      case 'inventory':
        return (
          <ProtectedRoute requiredRole="Admin">
            <InventoryList
              inventory={inventory}
              transactions={transactions}
              suppliers={suppliers}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onAddSupplier={handleAddSupplier}
            />
          </ProtectedRoute>
        );
      case 'input':
        return (
          <StockTransactions
            type="input"
            inventory={inventory}
            staff={staff}
            transactions={transactions}
            onTransaction={handleTransaction}
          />
        );
      case 'output':
        return (
          <StockTransactions
            type="output"
            inventory={inventory}
            staff={staff}
            transactions={transactions}
            onTransaction={handleTransaction}
          />
        );
      case 'staff':
        return (
          <ProtectedRoute requiredRole="Admin">
            <StaffManagement
              staff={staff}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
              onDeleteStaff={handleDeleteStaff}
            />
          </ProtectedRoute>
        );
      case 'history':
        return <TransactionHistory transactions={transactions} />;
      case 'clients':
        return <Clients transactions={transactions} />;
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
        userProfile={userProfile}
        onSignOut={signOut}
      />
      <main className="flex-1 p-4 lg:p-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;