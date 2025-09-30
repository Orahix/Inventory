import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { InventoryItem } from '../types';

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('inventory_items')
        .select(`
          id,
          name,
          category,
          project,
          current_stock,
          min_stock,
          max_stock,
          unit_price,
          supplier,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      // Map snake_case to camelCase
      const mappedItems = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        project: item.project,
        currentStock: item.current_stock,
        minStock: item.min_stock,
        maxStock: item.max_stock,
        unitPrice: item.unit_price,
        supplier: item.supplier,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      
      setItems(mappedItems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (itemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      // Map camelCase to snake_case for database
      const dbData = {
        name: itemData.name,
        category: itemData.category,
        project: itemData.project,
        current_stock: itemData.currentStock,
        min_stock: itemData.minStock,
        max_stock: itemData.maxStock,
        unit_price: itemData.unitPrice,
        supplier: itemData.supplier
      };
      
      const { data, error: insertError } = await supabase
        .from('inventory_items')
        .insert([dbData])
        .select(`
          id,
          name,
          category,
          project,
          current_stock,
          min_stock,
          max_stock,
          unit_price,
          supplier,
          created_at,
          updated_at
        `)
        .single();

      if (insertError) throw insertError;
      
      // Map snake_case to camelCase
      const mappedItem = {
        id: data.id,
        name: data.name,
        category: data.category,
        project: data.project,
        currentStock: data.current_stock,
        minStock: data.min_stock,
        maxStock: data.max_stock,
        unitPrice: data.unit_price,
        supplier: data.supplier,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setItems(prev => [...prev, mappedItem]);
      return mappedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: string, itemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      // Map camelCase to snake_case for database
      const dbData = {
        name: itemData.name,
        category: itemData.category,
        project: itemData.project,
        current_stock: itemData.currentStock,
        min_stock: itemData.minStock,
        max_stock: itemData.maxStock,
        unit_price: itemData.unitPrice,
        supplier: itemData.supplier
      };
      
      const { data, error: updateError } = await supabase
        .from('inventory_items')
        .update(dbData)
        .eq('id', id)
        .select(`
          id,
          name,
          category,
          project,
          current_stock,
          min_stock,
          max_stock,
          unit_price,
          supplier,
          created_at,
          updated_at
        `)
        .single();

      if (updateError) throw updateError;
      
      // Map snake_case to camelCase
      const mappedItem = {
        id: data.id,
        name: data.name,
        category: data.category,
        project: data.project,
        currentStock: data.current_stock,
        minStock: data.min_stock,
        maxStock: data.max_stock,
        unitPrice: data.unit_price,
        supplier: data.supplier,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setItems(prev => prev.map(item => item.id === id ? mappedItem : item));
      return mappedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refetch: fetchItems
  };
};