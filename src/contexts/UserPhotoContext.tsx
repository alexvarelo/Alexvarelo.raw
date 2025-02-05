"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UserPhotoContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserPhotoContext = createContext<UserPhotoContextType | undefined>(undefined);

export function UserPhotoProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserPhotoContext.Provider value={{ user, setUser }}>
      {children}
    </UserPhotoContext.Provider>
  );
}

export function useUserPhoto() {
  const context = useContext(UserPhotoContext);
  if (context === undefined) {
    throw new Error("useUserPhoto must be used within a UserPhotoProvider");
  }
  return context;
} 