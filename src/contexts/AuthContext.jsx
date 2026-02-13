import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查当前用户
    authService.getCurrentUser()
      .then((user) => {
        setUser(user);
        setLoading(false);
      })
      .catch((error) => {
        console.warn('Auth initialization error:', error);
        setLoading(false);
      });

    // 监听认证状态变化
    try {
      const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.warn('Auth state change listener error:', error);
      setLoading(false);
    }
  }, []);

  const signUp = async (email, password, username) => {
    const { data, error } = await authService.signUp(email, password, username);
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await authService.signIn(email, password);
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
