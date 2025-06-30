import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { register } from '../apis/apiLoginRegister';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [role, setRole] = useState('alumno');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const body = { email, password, nombre, apellido, role };
      const result = await register(body);
      router.replace('/Login');
    } catch (err) {
      console.error('Error al registrar:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={50}
    >
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text variant="displayMedium" style={styles.title}>Registro</Text>

          <SegmentedButtons
            value={role}
            onValueChange={setRole}
            buttons={[
              {
                value: 'alumno',
                label: 'Alumno',
                style: {
                  backgroundColor: role === 'alumno' ? '#059669' : 'transparent',
                  borderColor: '#059669',
                  borderWidth: 1,
                },
                labelStyle: { color: role === 'alumno' ? '#fff' : '#059669', fontWeight: 'bold' },
              },
              {
                value: 'profesor',
                label: 'Profesor',
                style: {
                  backgroundColor: role === 'profesor' ? '#2563eb' : 'transparent',
                  borderColor: '#2563eb',
                  borderWidth: 1,
                },
                labelStyle: { color: role === 'profesor' ? '#fff' : '#2563eb', fontWeight: 'bold' },
              },
            ]}
            style={styles.segmented}
          />

          <TextInput
            label="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                text: '#000',
                primary: '#3b82f6',
                placeholder: '#000',
              },
            }}
          />
          <TextInput
            label="Apellido"
            value={apellido}
            onChangeText={setApellido}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                text: '#000',
                primary: '#3b82f6',
                placeholder: '#000',
              },
            }}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                text: '#000',
                primary: '#3b82f6',
                placeholder: '#000',
              },
            }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                text: '#000',
                primary: '#3b82f6',
                placeholder: '#000',
              },
            }}
          />

          <Text style={styles.selectedRole}>
            Rol seleccionado: <Text style={role === 'profesor' ? styles.profesorText : styles.alumnoText}>{role}</Text>
          </Text>

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            contentStyle={{ paddingVertical: 10 }}
            labelStyle={{ color: '#fff', fontWeight: 'bold' }}
          >
            Registrarse
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
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    borderRadius: 12,
  },
  segmented: {
    marginBottom: 24,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedRole: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
  },
  alumnoText: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  profesorText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#10b981',
    borderRadius: 30,
    marginTop: 16,
  },
});