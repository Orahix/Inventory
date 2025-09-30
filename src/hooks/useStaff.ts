import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StaffMember } from '../types';

export const useStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('staff_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedStaff: StaffMember[] = data.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        role: item.role as 'Admin' | 'Manager' | 'Staff',
        department: item.department,
        createdAt: new Date(item.created_at).toLocaleDateString(),
      }));

      setStaff(formattedStaff);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch staff';
      setError(errorMessage);
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const addStaff = async (staffData: Omit<StaffMember, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('staff_members')
        .insert([{
          name: staffData.name,
          email: staffData.email,
          role: staffData.role,
          department: staffData.department,
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      
      const newStaff: StaffMember = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        createdAt: new Date(data.created_at).toLocaleDateString(),
      };

      setStaff(prev => [newStaff, ...prev]);
      return newStaff;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add staff member';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStaff = async (id: string, staffData: Omit<StaffMember, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('staff_members')
        .update({
          name: staffData.name,
          email: staffData.email,
          role: staffData.role,
          department: staffData.department,
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      const updatedStaff: StaffMember = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        createdAt: new Date(data.created_at).toLocaleDateString(),
      };

      setStaff(prev => prev.map(member => member.id === id ? updatedStaff : member));
      return updatedStaff;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update staff member';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setStaff(prev => prev.filter(member => member.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete staff member';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    staff,
    loading,
    error,
    addStaff,
    updateStaff,
    deleteStaff,
    refetch: fetchStaff,
  };
};