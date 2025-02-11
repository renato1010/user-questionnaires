'use client';
import { createContext, useContext, ReactNode, useState, useEffect, use } from 'react';
import { UserFrontend } from '@/lib/db/types';

type UserContextType = {
  user: UserFrontend | null;
  setUser: (user: UserFrontend | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({
  children,
  userPromise
}: {
  children: ReactNode;
  userPromise: Promise<UserFrontend | null>;
}) {
  const initialUser = use(userPromise);
  const [user, setUser] = useState<UserFrontend | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}
