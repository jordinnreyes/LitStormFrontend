// utils/auth.ts
import * as SecureStore from 'expo-secure-store';

// Guarda el token después del login
export async function saveToken(token: string) {
  await SecureStore.setItemAsync('userToken', token);
}

// Obtiene el token guardado para llamadas autenticadas
export async function getTokenFromStorage(): Promise<string> {
  const token = await SecureStore.getItemAsync('userToken');
  if (!token) throw new Error('Token no encontrado');
  return token;
}