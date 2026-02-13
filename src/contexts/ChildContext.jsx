import { createContext, useContext, useState, useEffect } from 'react';
import { childrenService } from '../services/supabase';
import { useAuth } from './AuthContext';

const ChildContext = createContext({});

export const useChild = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};

export const ChildProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentChild, setCurrentChild] = useState(() => {
    // Initialize from localStorage on mount
    const selectedAge = localStorage.getItem('selectedAge');
    if (selectedAge) {
      return {
        name: localStorage.getItem('childName') || 'Little Friend',
        age_level: selectedAge
      };
    }
    return null;
  });
  const [childrenList, setChildrenList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 从localStorage同步年龄级别（在变化时）
  useEffect(() => {
    const selectedAge = localStorage.getItem('selectedAge');
    if (selectedAge) {
      setCurrentChild(prev => ({
        ...(prev || {}),
        name: localStorage.getItem('childName') || 'Little Friend',
        age_level: selectedAge
      }));
    }
  }, []);

  // 监听localStorage变化
  useEffect(() => {
    const handleStorageChange = () => {
      const selectedAge = localStorage.getItem('selectedAge');
      if (selectedAge) {
        setCurrentChild(prev => ({
          ...(prev || {}),
          name: localStorage.getItem('childName') || 'Little Friend',
          age_level: selectedAge
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 加载孩子列表
  useEffect(() => {
    const loadChildren = async () => {
      if (!user) {
        setChildrenList([]);
        // Don't clear currentChild if it's loaded from localStorage
        // Only clear if there's no selectedAge in localStorage
        const selectedAge = localStorage.getItem('selectedAge');
        if (!selectedAge) {
          setCurrentChild(null);
        }
        return;
      }

      setLoading(true);
      const { data, error } = await childrenService.getChildren(user.id);

      if (!error && data) {
        setChildrenList(data);
        // 如果还没有选择孩子，自动选择第一个
        if (!currentChild && data.length > 0) {
          setCurrentChild(data[0]);
        }
      }
      setLoading(false);
    };

    loadChildren();
  }, [user]);

  const refreshChildren = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await childrenService.getChildren(user.id);

    if (!error && data) {
      setChildrenList(data);
      // 如果还没有选择孩子，自动选择第一个
      if (!currentChild && data.length > 0) {
        setCurrentChild(data[0]);
      }
    }
    setLoading(false);
  };

  const createChild = async (childData) => {
    const { data, error } = await childrenService.createChild({
      ...childData,
      parent_id: user.id
    });

    if (!error && data) {
      setChildrenList([...childrenList, data]);
      setCurrentChild(data);
    }

    return { data, error };
  };

  const updateChild = async (childId, updates) => {
    const { data, error } = await childrenService.updateChild(childId, updates);

    if (!error && data) {
      setChildrenList(childrenList.map(child =>
        child.id === childId ? data : child
      ));
      if (currentChild?.id === childId) {
        setCurrentChild(data);
      }
    }

    return { data, error };
  };

  const deleteChild = async (childId) => {
    const { error } = await childrenService.deleteChild(childId);

    if (!error) {
      const newList = childrenList.filter(child => child.id !== childId);
      setChildrenList(newList);
      if (currentChild?.id === childId) {
        setCurrentChild(newList[0] || null);
      }
    }

    return { error };
  };

  const switchChild = (childId) => {
    const child = childrenList.find(c => c.id === childId);
    if (child) {
      setCurrentChild(child);
    }
  };

  const value = {
    currentChild,
    childrenList,
    loading,
    createChild,
    updateChild,
    deleteChild,
    switchChild,
    refreshChildren
  };

  return (
    <ChildContext.Provider value={value}>
      {children}
    </ChildContext.Provider>
  );
};
