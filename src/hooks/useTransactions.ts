import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedTransactions: Transaction[] = data.map(item => ({
        id: item.id,
        itemId: item.item_id || '',
        itemName: item.item_name,
        type: item.type as 'input' | 'output',
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalValue: item.total_value,
        project: item.project,
        staffId: item.staff_id || '',
        staffName: item.staff_name,
        date: new Date(item.created_at).toLocaleDateString(),
        comment: item.comment || undefined,
      }));

      setTransactions(formattedTransactions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    setLoading(true);
    setError(null);
    try {
      // Start a transaction to update both tables
      const { data: transactionResult, error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          item_id: transactionData.itemId,
          item_name: transactionData.itemName,
          type: transactionData.type,
          quantity: transactionData.quantity,
          unit_price: transactionData.unitPrice,
          total_value: transactionData.totalValue,
          project: transactionData.project,
          staff_id: transactionData.staffId,
          staff_name: transactionData.staffName,
          comment: transactionData.comment,
        }])
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Update inventory stock
      const { data: currentItem, error: fetchError } = await supabase
        .from('inventory_items')
        .select('current_stock')
        .eq('id', transactionData.itemId)
        .single();

      if (fetchError) throw fetchError;

      const newStock = transactionData.type === 'input' 
        ? currentItem.current_stock + transactionData.quantity
        : currentItem.current_stock - transactionData.quantity;

      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ current_stock: newStock })
        .eq('id', transactionData.itemId);

      if (updateError) throw updateError;

      const newTransaction: Transaction = {
        id: transactionResult.id,
        itemId: transactionResult.item_id || '',
        itemName: transactionResult.item_name,
        type: transactionResult.type as 'input' | 'output',
        quantity: transactionResult.quantity,
        unitPrice: transactionResult.unit_price,
        totalValue: transactionResult.total_value,
        project: transactionResult.project,
        staffId: transactionResult.staff_id || '',
        staffName: transactionResult.staff_name,
        date: new Date(transactionResult.created_at).toLocaleDateString(),
        comment: transactionResult.comment || undefined,
      };

      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add transaction';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    refetch: fetchTransactions,
  };
};