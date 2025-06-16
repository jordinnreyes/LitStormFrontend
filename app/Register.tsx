// app/(auth)/register.tsx
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
  const [role, setRole] = useState('alumno'); // valor por defecto

  const router = useRouter();

  const handleRegister = async () => {
    try {
      const body = {
        email,
        password,
        nombre,
        apellido,
        role
      };
      
      const result = await register(body);
      console.log('Registro exitoso:', result);
      // Redirigir al login
      router.replace('/Login'); // o router.push('/Login')
    } catch (err) {
      console.error('Error al registrar:', err);
    }
  };


  const roleTextColor = role === 'profesor' ? styles.profesorText : styles.alumnoText;

  return (
        <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={50} // ajusta si tienes header o barra de estado
    >
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="titleLarge" style={styles.title}>Registro</Text>

            <SegmentedButtons
        value={role}
        onValueChange={setRole}
        buttons={[
          {
            value: 'alumno',
            label: 'Alumno',
            style: {
              backgroundColor: role === 'alumno' ? '#d0f0c0' : undefined,
            },
          },
          {
            value: 'profesor',
            label: 'Profesor',
            style: {
              backgroundColor: role === 'profesor' ? '#c0d4f0' : undefined,
            },
          },
        ]}
        style={styles.segmented}
      />



        <TextInput
        label="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        label="Apellido"
        value={apellido}
        onChangeText={setApellido}
        style={styles.input}
      />
      
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



      {/* Texto de Rol seleccionado con estilo dinámico */}
      <Text style={[styles.selectedRole, roleTextColor]}>
        Rol seleccionado: {role}
      </Text>

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Registrarse
      </Button>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  input: { marginBottom: 12 },
  title: { marginBottom: 20, textAlign: 'center' },
  button: { marginTop: 20 },
  segmented: { marginVertical: 12 },

  // Colores dinámicos
  selectedRole: { fontSize: 16, textAlign: 'center', marginVertical: 10 },
  alumnoText: { color: 'green', fontWeight: 'bold' },
  profesorText: { color: 'blue', fontWeight: 'bold' },
});

