import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            createdAt: session.user.created_at,
            userType: session.user.user_metadata.user_type || 'individual',
            companyName: session.user.user_metadata.company_name,
            isVerifiedBrand: session.user.user_metadata.is_verified_brand || false,
            avatar: session.user.user_metadata.avatar,
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          createdAt: session.user.created_at,
          userType: session.user.user_metadata.user_type || 'individual',
          companyName: session.user.user_metadata.company_name,
          isVerifiedBrand: session.user.user_metadata.is_verified_brand || false,
          avatar: session.user.user_metadata.avatar,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login attempt:', { data, error });

      if (error) {
        console.error('Login error:', error.message);
        console.error('Error details:', error);
        return false;
      }

      if (data?.user) {
        console.log('Login successful:', data.user);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Unexpected login error:', err);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    userType: 'individual' | 'company' = 'individual',
    companyName?: string
  ): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          user_type: userType,
          company_name: companyName,
          is_verified_brand: false, // Admin will verify later
        },
      },
    });

    if (error) {
      console.error('Signup error:', error.message);
      return false;
    }
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

