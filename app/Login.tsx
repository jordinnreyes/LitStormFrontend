import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { fetchUserProfile } from '../apis/apiGetProfileRole';
import { login } from '../apis/apiLoginRegister';
import { useAuth } from '../context/AuthContext';

type Props = { onAuthenticate: (token: string) => void; };

export default function LoginScreen({ onAuthenticate }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setToken, setRole } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    try {
      const token = await login(email, password);
      setToken(token);
      await SecureStore.setItemAsync('token', token);

      const user: any = await fetchUserProfile(token);
      setRole(user.role);
      await SecureStore.setItemAsync('role', user.role);
      if (user.id) await SecureStore.setItemAsync('alumnoId', user.id.toString());

      if (user.role === 'alumno') router.replace('/AlumnoHome');
      else if (user.role === 'profesor') router.replace('/ProfesorHome');

      if (onAuthenticate) onAuthenticate(token);
    } catch (e) {
      setError('Invalid credentials or server error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <LinearGradient
        colors={['#1e3c72', '#2a5298']} // nuevo fondo azul profundo
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text variant="displayMedium" style={styles.title}>LitStorm</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
            theme={{ colors: { text: '#111827', primary: '#3b82f6' } }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { text: '#111827', primary: '#3b82f6' } }}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.loginButton}
            contentStyle={{ paddingVertical: 10 }}
            labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
          >
            Iniciar sesión
          </Button>

          <Button
            onPress={() => router.push('/Register')}
            style={styles.registerButton}
            labelStyle={{ color: '#fff', fontWeight: 'bold' }}
          >
            ¿No tienes cuenta? Regístrate
          </Button>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#FFDC64',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    marginBottom: 16,
    borderRadius: 12,
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 30,
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: '#10b981',
    borderRadius: 30,
    marginTop: 12,
  },
  error: {
    color: '#f87171',
    textAlign: 'center',
    marginBottom: 10,
  },
}); 