import React from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Filter } from 'lucide-react';
import { InventoryItem, Transaction } from '../types';

interface DashboardProps {
  inventory: InventoryItem[];
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ inventory, transactions }) => {
  const [selectedProject, setSelectedProject] = React.useState<string>('all');
  
  // Get unique projects from transactions
  const projects = Array.from(new Set(transactions.map(t => t.project))).filter(Boolean);
  
  // Filter inventory by project
  const filteredInventory = selectedProject === 'all' 
    ? inventory 
    : inventory.filter(item => item.project === selectedProject);
  
  const filteredTransactions = selectedProject === 'all'
    ? transactions
    : transactions.filter(t => t.project === selectedProject);

  const totalItems = filteredInventory.length;
  const totalValue = filteredInventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
  const lowStockItems = filteredInventory.filter(item => item.currentStock <= item.minStock);
  const recentTransactions = filteredTransactions.slice(0, 5);

  const cards = [
    {
      title: 'Ukupno stavki',
      value: totalItems.toString(),
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Ukupna vrednost',
      value: `${totalValue.toLocaleString()} RSD`,
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Upozorenja o niskim zalihama',
      value: lowStockItems.length.toString(),
      icon: AlertTriangle,
      color: 'red',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Kontrolna tabla</h1>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">Svi projekti</option>
            {projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-xl lg:text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-2 lg:p-3 rounded-full bg-${card.color}-100`}>
                  <Icon className={`h-5 w-5 lg:h-6 lg:w-6 text-${card.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4">Upozorenja o niskim zalihama</h3>
          {lowStockItems.length === 0 ? (
            <p className="text-sm text-gray-500">Nema stavki sa niskim zalihama</p>
          ) : (
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 lg:p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm lg:text-base font-medium text-gray-900 truncate max-w-[200px]">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm lg:text-base font-semibold text-red-600">{item.currentStock}</p>
                    <p className="text-xs text-gray-500">Min: {item.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4">Nedavne transakcije</h3>
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-500">Nema nedavnih transakcija</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 lg:p-2 rounded-full ${
                      transaction.type === 'input' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'input' ? (
                        <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm lg:text-base font-medium text-gray-900 truncate max-w-[150px]">{transaction.itemName}</p>
                      <p className="text-xs lg:text-sm text-gray-600 truncate max-w-[150px]">{transaction.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm lg:text-base font-semibold ${
                      transaction.type === 'input' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'input' ? '+' : '-'}{transaction.quantity}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};