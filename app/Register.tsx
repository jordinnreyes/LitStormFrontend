// app/(auth)/register.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { marginBottom: 12 },
  title: { marginBottom: 20, textAlign: 'center' },
  button: { marginTop: 20 },
  segmented: { marginVertical: 12 },

  // Colores dinámicos
  selectedRole: { fontSize: 16, textAlign: 'center', marginVertical: 10 },
  alumnoText: { color: 'green', fontWeight: 'bold' },
  profesorText: { color: 'blue', fontWeight: 'bold' },
});





/*adsadasda 

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { registerUser } from '../apis/apiLoginRegister.js';
import SegmentedButtons from 'react-native-paper';


export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('alumno'); // o 'profesor'

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !nombre || !apellido) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      await registerUser({ email, password, nombre, apellido, role });
      Alert.alert('Éxito', 'Registro completado');
      router.replace('/Login'); // redirige a login
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Registro</Text>
        <SegmentedButtons
            value={role}
            onValueChange={setRole}
            buttons={[
                { value: 'alumno', label: 'Alumno' },
                { value: 'profesor', label: 'Profesor' },
            ]}
            />
      <TextInput label="Rol (alumno o profesor)" value={role} onChangeText={setRole} style={styles.input} />
      <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput label="Apellido" value={apellido} onChangeText={setApellido} style={styles.input} />
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button mode="contained" onPress={handleRegister} loading={loading}>
        Registrarse
      </Button>

      <Button onPress={() => router.replace('/Login')}>
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { marginBottom: 12 },
  error: { color: 'red', marginBottom: 10 },
  title: { marginBottom: 20, textAlign: 'center' }
});


*/