import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { fetchUserProfile } from '../apis/apiGetProfileRole';
import { login } from '../apis/apiLoginRegister';

// Props del componente
type Props = {onAuthenticate: (token: string) => void;};


export default function LoginScreen({onAuthenticate }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();


  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const token = await login(email, password); // usa email como username
      console.log("Token obtenido:", token);
      await SecureStore.setItemAsync('token', token);


      const user = await fetchUserProfile(token);
      console.log("Usuario logueado:", user);


      // Redirige según el rol
      if (user.role === 'alumno') {
        router.replace('/AlumnoHome');
      } else if (user.role === 'profesor') {
        router.replace('/ProfesorHome');
      }

      // Intenta ejecutar el callback
      onAuthenticate(token); // <- puede lanzar error si es undefined o mal implementado
    } catch (e) {
      setError('Invalid credentials or server error');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Iniciar sesión</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button mode="contained" onPress={handleLogin}>Login</Button>
      <Button onPress={() => router.push('/Register')}>¿No tienes cuenta? Regístrate</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { marginBottom: 12 },
  error: { color: 'red', marginBottom: 10 },
  title: { marginBottom: 20, textAlign: 'center' }
});
