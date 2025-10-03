import React, { useState } from 'react';
import { Search, Filter, TrendingDown, Package, Calendar, Eye, Download } from 'lucide-react';
import { Transaction } from '../types';
import { Modal } from './Modal';

interface ClientsProps {
  transactions: Transaction[];
}

export const Clients: React.FC<ClientsProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const exportToCSV = () => {
    const csvData = filteredTransactions.map(transaction => ({
      'Datum': transaction.date,
      'Projekat': transaction.project,
      'Stavka': transaction.itemName,
      'Količina': -transaction.quantity,
      'Jedinična cena': transaction.unitPrice.toFixed(2),
      'Ukupna vrednost': transaction.totalValue.toFixed(2),
      'Osoblje': transaction.staffName,
      'Komentar': transaction.comment || ''
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          // Escape commas and quotes in CSV
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const fileName = selectedProject === 'all' 
      ? 'klijenti_svi_projekti.csv'
      : `klijenti_${selectedProject.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get unique projects from output transactions
  const projects = Array.from(new Set(
    transactions
      .filter(t => t.type === 'output')
      .map(t => t.project)
  )).filter(Boolean).sort();

  // Filter transactions to show only outputs
  const outputTransactions = transactions.filter(t => t.type === 'output');

  const filteredTransactions = outputTransactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.project.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProject = selectedProject === 'all' || transaction.project === selectedProject;
      
      return matchesSearch && matchesProject;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate project statistics
  const projectStats = projects.map(project => {
    const projectTransactions = outputTransactions.filter(t => t.project === project);
    const totalValue = projectTransactions.reduce((sum, t) => sum + t.totalValue, 0);
    const totalItems = projectTransactions.reduce((sum, t) => sum + t.quantity, 0);
    const uniqueComponents = new Set(projectTransactions.map(t => t.itemName)).size;
    
    return {
      project,
      totalValue,
      totalItems,
      uniqueComponents,
      transactionCount: projectTransactions.length
    };
  }).sort((a, b) => b.totalValue - a.totalValue);

  const selectedProjectStats = selectedProject === 'all' 
    ? {
        totalValue: outputTransactions.reduce((sum, t) => sum + t.totalValue, 0),
        totalItems: outputTransactions.reduce((sum, t) => sum + t.quantity, 0),
        uniqueComponents: new Set(outputTransactions.map(t => t.itemName)).size,
        transactionCount: outputTransactions.length
      }
    : projectStats.find(p => p.project === selectedProject) || {
        totalValue: 0,
        totalItems: 0,
        uniqueComponents: 0,
        transactionCount: 0
      };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Klijenti - Izlaz materijala</h1>
        <button
          onClick={exportToCSV}
          disabled={filteredTransactions.length === 0}
          className="flex items-center px-3 lg:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm lg:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
          Izvezi CSV
        </button>
      </div>

      {/* Project Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ukupna vrednost</p>
              <p className="text-xl font-bold text-blue-600">{selectedProjectStats.totalValue.toFixed(0)} RSD</p>
            </div>
            <TrendingDown className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ukupno stavki</p>
              <p className="text-xl font-bold text-green-600">{selectedProjectStats.totalItems}</p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Različitih komponenti</p>
              <p className="text-xl font-bold text-purple-600">{selectedProjectStats.uniqueComponents}</p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Broj transakcija</p>
              <p className="text-xl font-bold text-orange-600">{selectedProjectStats.transactionCount}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Project Overview Cards */}
      {selectedProject === 'all' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pregled projekata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectStats.slice(0, 6).map((stats) => (
              <div key={stats.project} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2 truncate" title={stats.project}>
                  {stats.project}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Vrednost: <span className="font-medium text-blue-600">{stats.totalValue.toFixed(0)} RSD</span></p>
                  <p>Stavki: <span className="font-medium">{stats.totalItems}</span></p>
                  <p>Komponenti: <span className="font-medium">{stats.uniqueComponents}</span></p>
                </div>
                <button
                  onClick={() => setSelectedProject(stats.project)}
                  className="mt-3 w-full px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100 transition-colors"
                >
                  Prikaži detalje
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pretraži izlaze materijala..."
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
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Datum</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Projekat</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Stavka</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Količina</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Cena</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Vrednost</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Osoblje</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Detalji</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 lg:px-4 text-xs lg:text-sm text-gray-600">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-2 lg:px-4 font-medium text-gray-900 text-xs lg:text-sm">
                    <div className="max-w-[120px] lg:max-w-none truncate" title={transaction.project}>
                      {transaction.project}
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-gray-600 text-xs lg:text-sm">
                    <div className="max-w-[120px] lg:max-w-none truncate" title={transaction.itemName}>
                      {transaction.itemName}
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-red-600 font-medium text-xs lg:text-sm">
                    -{transaction.quantity}
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-gray-600 text-xs lg:text-sm">{transaction.unitPrice.toFixed(0)}</td>
                  <td className="py-3 px-2 lg:px-4 text-gray-900 font-medium text-xs lg:text-sm">{transaction.totalValue.toFixed(0)}</td>
                  <td className="py-3 px-2 lg:px-4 text-gray-600 text-xs lg:text-sm">
                    <div className="max-w-[100px] lg:max-w-none truncate" title={transaction.staffName}>
                      {transaction.staffName}
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:px-4">
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Prikaži detalje"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || selectedProject !== 'all' ? 'Nema izlaza materijala koji odgovaraju filterima.' : 'Nema pronađenih izlaza materijala.'}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Detalji izlaza materijala"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                <p className="text-sm text-gray-900">{selectedTransaction.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tip transakcije</label>
                <div className="flex items-center">
                  <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-red-600 font-medium">Izlaz robe</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Projekat</label>
                <p className="text-sm text-gray-900">{selectedTransaction.project}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stavka</label>
                <p className="text-sm text-gray-900">{selectedTransaction.itemName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Količina</label>
                <p className="text-sm font-medium text-red-600">-{selectedTransaction.quantity}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jedinična cena</label>
                <p className="text-sm text-gray-900">{selectedTransaction.unitPrice.toFixed(2)} RSD</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ukupna vrednost</label>
                <p className="text-sm font-semibold text-gray-900">{selectedTransaction.totalValue.toFixed(2)} RSD</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Osoblje</label>
                <p className="text-sm text-gray-900">{selectedTransaction.staffName}</p>
              </div>
            </div>
            {selectedTransaction.comment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedTransaction.comment}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};