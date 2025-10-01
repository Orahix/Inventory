import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Calendar, Filter, Eye, X } from 'lucide-react';
import { Transaction } from '../types';
import { Modal } from './Modal';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'input' | 'output'>('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.project.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalValue = filteredTransactions.reduce((sum, t) => sum + t.totalValue, 0);
  const inputTransactions = filteredTransactions.filter(t => t.type === 'input');
  const outputTransactions = filteredTransactions.filter(t => t.type === 'output');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Istorija transakcija</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Ukupno transakcija</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
            </div>
            <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Ulaz robe</p>
              <p className="text-xl lg:text-2xl font-bold text-green-600">{inputTransactions.length}</p>
            </div>
            <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Izlaz robe</p>
              <p className="text-xl lg:text-2xl font-bold text-red-600">{outputTransactions.length}</p>
            </div>
            <TrendingDown className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pretraži transakcije..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'input' | 'output')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            >
              <option value="all">Svi tipovi</option>
              <option value="input">Ulaz robe</option>
              <option value="output">Izlaz robe</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Datum</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Tip</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Stavka</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Količina</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Cena</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Vrednost</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Osoblje</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Projekat</th>
                <th className="text-left py-3 px-2 lg:px-4 font-semibold text-gray-700 text-sm lg:text-base">Detalji</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 lg:px-4 text-xs lg:text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 lg:px-4">
                    <div className="flex items-center">
                      {transaction.type === 'input' ? (
                        <>
                          <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600 mr-1 lg:mr-2" />
                          <span className="text-green-600 font-medium text-xs lg:text-sm">Ulaz</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-red-600 mr-1 lg:mr-2" />
                          <span className="text-red-600 font-medium text-xs lg:text-sm">Izlaz</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:px-4 font-medium text-gray-900 text-xs lg:text-sm">
                    <div className="max-w-[120px] lg:max-w-none truncate" title={transaction.itemName}>
                      {transaction.itemName}
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-gray-600 text-xs lg:text-sm">
                    <span className={`font-medium ${transaction.type === 'input' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'input' ? '+' : '-'}{transaction.quantity}
                    </span>
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-gray-600 text-xs lg:text-sm">{transaction.unitPrice.toFixed(0)}</td>
                  <td className="py-3 px-2 lg:px-4 text-gray-900 font-medium text-xs lg:text-sm">{transaction.totalValue.toFixed(0)}</td>
                  <td className="py-3 px-2 lg:px-4 text-gray-600 text-xs lg:text-sm">
                    <div className="max-w-[100px] lg:max-w-none truncate" title={transaction.staffName}>
                      {transaction.staffName}
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:px-4 text-gray-600 text-xs lg:text-sm">
                    <div className="max-w-[120px] lg:max-w-none truncate" title={transaction.project}>
                      {transaction.project}
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
            {searchTerm || typeFilter !== 'all' ? 'Nema transakcija koje odgovaraju filterima.' : 'Nema pronađenih transakcija.'}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Detalji transakcije"
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
                  {selectedTransaction.type === 'input' ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-600 font-medium">Ulaz robe</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
                      <span className="text-red-600 font-medium">Izlaz robe</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stavka</label>
                <p className="text-sm text-gray-900">{selectedTransaction.itemName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Količina</label>
                <p className={`text-sm font-medium ${selectedTransaction.type === 'input' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedTransaction.type === 'input' ? '+' : '-'}{selectedTransaction.quantity}
                </p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Projekat</label>
                <p className="text-sm text-gray-900">{selectedTransaction.project}</p>
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