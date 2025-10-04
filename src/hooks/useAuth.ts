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
    console.log('useAuth: Starting authentication check');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('useAuth: Initial session check', { session: !!session, error });
      
      if (error) {
        console.error('useAuth: Session error:', error);
        setError('Failed to check authentication status');
        setLoading(false);
        return;
      }
      
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('useAuth: User found, fetching profile');
        fetchUserProfile(session.user.id);
      } else {
        console.log('useAuth: No user session found');
        setLoading(false);
      }
    }).catch((err) => {
      console.error('useAuth: Session check failed:', err);
      setError('Authentication system unavailable');
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed', { event, session: !!session });
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
      console.log('fetchUserProfile: Starting for user', userId);
      setError(null);
      
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      console.log('fetchUserProfile: Query result', { data: !!data, error: profileError });

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        if (profileError.code === 'PGRST116') {
          setError('User profile not found. Please contact administrator.');
        } else {
          setError(`Profile error: ${profileError.message}`);
        }
        setUserProfile(null);
      } else {
        console.log('fetchUserProfile: Profile loaded successfully');
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Profile fetch exception:', err);
      setError(`Failed to load user profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setUserProfile(null);
    } finally {
      console.log('fetchUserProfile: Setting loading to false');
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
        let errorMessage = signInError.message;
        
        // Provide more user-friendly error messages in Serbian
        if (signInError.message === 'Invalid login credentials') {
          errorMessage = 'Neispravni podaci za prijavu. Proverite email adresu i lozinku.';
        } else if (signInError.message.includes('Email not confirmed')) {
          errorMessage = 'Email adresa nije potvrđena. Proverite vaš email za link za potvrdu.';
        } else if (signInError.message.includes('Too many requests')) {
          errorMessage = 'Previše pokušaja prijave. Pokušajte ponovo za nekoliko minuta.';
        }
        
        setError(errorMessage);
        return { success: false, error: errorMessage };
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