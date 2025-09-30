import React from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Filter, BarChart3 } from 'lucide-react';
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      <p className="text-xs lg:text-sm text-gray-600 truncate max-w-[150px]">{transaction.project}</p>
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

      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-800">Trend korišćenja komponenti</h3>
          <TrendingUp className="h-6 w-6 text-purple-600" />
        </div>

        {(() => {
          // Get last 30 days of transactions
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const recentOutputs = filteredTransactions
            .filter(t => t.type === 'output' && new Date(t.date) >= thirtyDaysAgo)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          // Group by item and calculate cumulative usage
          const itemUsage = recentOutputs.reduce((acc, transaction) => {
            if (!acc[transaction.itemName]) {
              acc[transaction.itemName] = {
                name: transaction.itemName,
                totalUsed: 0,
                dailyUsage: []
              };
            }
            acc[transaction.itemName].totalUsed += transaction.quantity;
            return acc;
          }, {} as Record<string, { name: string; totalUsed: number; dailyUsage: any[] }>);

          const topUsedItems = Object.values(itemUsage)
            .sort((a, b) => b.totalUsed - a.totalUsed)
            .slice(0, 8);

          const maxUsage = Math.max(...topUsedItems.map(item => item.totalUsed), 1);

          return (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Najkorišćenije komponente u poslednjih 30 dana
              </div>
              
              {topUsedItems.length === 0 ? (
                <p className="text-center py-8 text-gray-500">Nema podataka o korišćenju komponenti</p>
              ) : (
                <div className="space-y-3">
                  {topUsedItems.map((item, index) => {
                    const percentage = (item.totalUsed / maxUsage) * 100;
                    const colors = [
                      'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
                      'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-gray-500'
                    ];
                    
                    return (
                      <div key={item.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                            <span className="text-sm lg:text-base font-medium text-gray-900 truncate max-w-[200px]" title={item.name}>
                              {item.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm lg:text-base font-semibold text-gray-900">
                              {item.totalUsed}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">kom</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${colors[index]}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-lg lg:text-xl font-bold text-purple-600">
                      {topUsedItems.reduce((sum, item) => sum + item.totalUsed, 0)}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-600">Ukupno korišćeno</p>
                  </div>
                  <div>
                    <p className="text-lg lg:text-xl font-bold text-blue-600">
                      {topUsedItems.length}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-600">Različitih komponenti</p>
                  </div>
                  <div>
                    <p className="text-lg lg:text-xl font-bold text-green-600">
                      {Math.round((topUsedItems.reduce((sum, item) => sum + item.totalUsed, 0) / 30) * 10) / 10}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-600">Prosek dnevno</p>
                  </div>
                  <div>
                    <p className="text-lg lg:text-xl font-bold text-orange-600">
                      {topUsedItems.length > 0 ? topUsedItems[0].name.substring(0, 15) + (topUsedItems[0].name.length > 15 ? '...' : '') : 'N/A'}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-600">Najkorišćenija</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-gray-800">Materijali po projektima</h3>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="mb-4">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Svi projekti</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>

          {(() => {
            const projectTransactions = selectedProject === 'all' 
              ? transactions.filter(t => t.type === 'output')
              : transactions.filter(t => t.type === 'output' && t.project === selectedProject);
            
            const projectMaterials = projectTransactions.reduce((acc, transaction) => {
              const key = `${transaction.project}-${transaction.itemName}`;
              if (!acc[key]) {
                acc[key] = {
                  project: transaction.project,
                  itemName: transaction.itemName,
                  totalQuantity: 0,
                  totalValue: 0
                };
              }
              acc[key].totalQuantity += transaction.quantity;
              acc[key].totalValue += transaction.totalValue;
              return acc;
            }, {} as Record<string, { project: string; itemName: string; totalQuantity: number; totalValue: number }>);

            const sortedMaterials = Object.values(projectMaterials)
              .sort((a, b) => b.totalValue - a.totalValue)
              .slice(0, 5);
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
            return sortedMaterials.length === 0 ? (
              <p className="text-sm text-gray-500">Nema izvezenih materijala</p>
            ) : (
              <div className="space-y-3">
                {sortedMaterials.map((material, index) => (
                  <div key={`${material.project}-${material.itemName}`} className="flex items-center justify-between p-2 lg:p-3 bg-blue-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm lg:text-base font-medium text-gray-900 truncate">{material.itemName}</p>
                      <p className="text-xs text-gray-600 truncate">{material.project}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-sm lg:text-base font-semibold text-blue-600">{material.totalQuantity}</p>
                      <p className="text-xs text-gray-500">{material.totalValue.toFixed(0)} RSD</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};