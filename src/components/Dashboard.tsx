import React from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Filter, BarChart3 } from 'lucide-react';
import { InventoryItem, Transaction } from '../types';

interface DashboardProps {
  inventory: InventoryItem[];
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ inventory, transactions }) => {
  const [selectedProject, setSelectedProject] = React.useState<string>('all');

  const projects = Array.from(new Set(transactions.map(t => t.project))).filter(Boolean);

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
      bgColor: 'bg-[#82B0C5]',
      bgLight: 'bg-[#82B0C5] bg-opacity-10',
    },
    {
      title: 'Ukupna vrednost',
      value: `${totalValue.toLocaleString()} RSD`,
      icon: TrendingUp,
      bgColor: 'bg-[#2E7D32]',
      bgLight: 'bg-[#2E7D32] bg-opacity-10',
    },
    {
      title: 'Upozorenja o niskim zalihama',
      value: lowStockItems.length.toString(),
      icon: AlertTriangle,
      bgColor: 'bg-[#FF6F00]',
      bgLight: 'bg-[#FF6F00] bg-opacity-10',
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#2E2E2E]">Kontrolna tabla</h1>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-[#5A5A5A]" />
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input-field text-sm py-2"
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
            <div key={card.title} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#5A5A5A] mb-2">{card.title}</p>
                  <p className="text-3xl font-bold text-[#2E2E2E]">{card.value}</p>
                </div>
                <div className={`p-3 rounded-[10px] ${card.bgLight}`}>
                  <Icon className={`h-6 w-6 ${card.bgColor.replace('bg-', 'text-').replace(' bg-opacity-10', '')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-[#2E2E2E] mb-4">Upozorenja o niskim zalihama</h3>
          {lowStockItems.length === 0 ? (
            <p className="text-sm text-[#5A5A5A]">Nema stavki sa niskim zalihama</p>
          ) : (
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-[#FF6F00] bg-opacity-10 border border-[#FF6F00] border-opacity-20 rounded-[10px]">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#2E2E2E] truncate">{item.name}</p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-base font-semibold text-[#FF6F00]">{item.currentStock}</p>
                    <p className="text-xs text-[#5A5A5A]">Min: {item.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#2E2E2E]">Materijali po projektima</h3>
            <BarChart3 className="h-5 w-5 text-[#82B0C5]" />
          </div>

          <div className="mb-4">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="input-field text-sm py-2"
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

            return sortedMaterials.length === 0 ? (
              <p className="text-sm text-[#5A5A5A]">Nema izvezenih materijala</p>
            ) : (
              <div className="space-y-3">
                {sortedMaterials.map((material) => (
                  <div key={`${material.project}-${material.itemName}`} className="flex items-center justify-between p-3 bg-[#82B0C5] bg-opacity-10 border border-[#82B0C5] border-opacity-20 rounded-[10px]">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2E2E2E] truncate">{material.itemName}</p>
                      <p className="text-xs text-[#5A5A5A] truncate">{material.project}</p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-base font-semibold text-[#82B0C5]">{material.totalQuantity}</p>
                      <p className="text-xs text-[#5A5A5A]">{material.totalValue.toFixed(0)} RSD</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-[#2E2E2E] mb-4">Nedavne transakcije</h3>
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-[#5A5A5A]">Nema nedavnih transakcija</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-[#F3F4F6] rounded-[10px]">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'input' ? 'bg-[#2E7D32] bg-opacity-10' : 'bg-[#FF6F00] bg-opacity-10'
                    }`}>
                      {transaction.type === 'input' ? (
                        <TrendingUp className="h-4 w-4 text-[#2E7D32]" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-[#FF6F00]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#2E2E2E] truncate">{transaction.itemName}</p>
                      <p className="text-xs text-[#5A5A5A] truncate">{transaction.reason}</p>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className={`text-base font-semibold ${
                      transaction.type === 'input' ? 'text-[#2E7D32]' : 'text-[#FF6F00]'
                    }`}>
                      {transaction.type === 'input' ? '+' : '-'}{transaction.quantity}
                    </p>
                    <p className="text-xs text-[#5A5A5A]">{transaction.date}</p>
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
