// app.js o app.tsx
import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../context/AuthContext'; // ajusta la ruta si es necesario

export default function App() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

export default function App() {
  return (
    <>
      {/* tu navegación u otros componentes */}
      <Toast />
    </>
  );
}