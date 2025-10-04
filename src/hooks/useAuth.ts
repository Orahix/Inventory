import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  staff_id: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
  created_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      setError(null);
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        setError('Unable to load user profile. Please contact administrator.');
        setUserProfile(null);
      } else {
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Profile fetch exception:', err);
      setError('Failed to load user profile. Please try again.');
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return { success: false, error: signInError.message };
      }

      return { success: true, user: data.user };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError(signOutError.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => userProfile?.role === 'Admin';
  const isManager = () => userProfile?.role === 'Manager';
  const isStaff = () => userProfile?.role === 'Staff';
  const hasAccess = () => userProfile && ['Admin', 'Manager', 'Staff'].includes(userProfile.role);

  return {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signOut,
    isAdmin,
    isManager,
    isStaff,
    hasAccess,
  };
};