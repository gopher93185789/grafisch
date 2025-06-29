import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/schedule';
import { storageUtils } from '../utils/storage';

interface UserContextType {
  user: User | null;
  setUser: (user: User) => Promise<void>;
  clearUser: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await storageUtils.getUser();
      setUserState(savedUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUser = async (newUser: User) => {
    try {
      await storageUtils.saveUser(newUser);
      setUserState(newUser);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const clearUser = async () => {
    try {
      await storageUtils.clearAllData();
      setUserState(null);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  };

  const value: UserContextType = {
    user,
    setUser,
    clearUser,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 