import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
    role: string | null;
  setRole: (role: string | null) => void;
};


const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
    role: null,
  setRole: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // 👇 Nuevo: cargar el token al iniciar la app


  const [role, setRole] = useState<string | null>(null);


useEffect(() => {
  const loadToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('token');
      if (storedToken) {
        setToken(storedToken);
        console.log('🔐 Token cargado desde SecureStore:', storedToken);
      }
    } catch (error) {
      console.error('❌ Error al cargar el token:', error);
    } finally {
      setIsLoading(false); // ✅ Finaliza la carga
    }
  };

  loadToken();
}, []);
  
  return (
    <AuthContext.Provider value={{ token, setToken,role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
