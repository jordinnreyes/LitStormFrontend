import { getMisInscripciones, inscribirseCurso } from '@/apis/apiCursoYCodigo';
import TopBarUser from '@/components/TopBarUser';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, BackHandler, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';

interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  profesor_id: number;
  codigo_acceso: string;
}

interface Inscripcion {
  id: number;
  user_id: number;
  curso_id: number;
  curso: Curso;
}

export default function AlumnoHome() {
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const router = useRouter();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Confirmar salida", "¿Querés cerrar sesión y salir?", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Salir", onPress: () => {
              SecureStore.deleteItemAsync('token');
              BackHandler.exitApp();
            }
          }
        ]);
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Inicio Alumno',
      headerRight: () => <TopBarUser />,
      headerBackVisible: false,
    });
  }, [navigation]);

  const fetchInscripciones = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (!token) return;
    const data = await getMisInscripciones(token);
    setInscripciones(data as Inscripcion[]);
  };

  const handleInscribirse = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('No se encontró token');
      await inscribirseCurso(codigo, token);
      setMensaje('Inscripción exitosa');
      setCodigo('');
      fetchInscripciones();
    } catch (error) {
      console.error(error);
      setMensaje('Error al inscribirse');
    }
  };

  useEffect(() => {
    fetchInscripciones();
  }, []);

  return (
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text variant="displayMedium" style={styles.title}>Ingresar código de curso</Text>

        <TextInput
          label="Código"
          value={codigo}
          onChangeText={setCodigo}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { text: '#fff', primary: '#3b82f6', placeholder: '#ccc' } }}
        />

        <Button
          mode="contained"
          onPress={handleInscribirse}
          style={styles.button}
          contentStyle={{ paddingVertical: 10 }}
          labelStyle={{ color: '#fff', fontWeight: 'bold' }}
        >
          Inscribirse
        </Button>

        {mensaje ? <Text style={styles.message}>{mensaje}</Text> : null}

        <Text variant="titleMedium" style={styles.subtitle}>Mis cursos:</Text>

        {inscripciones.map((ins) => (
          <Card
            key={ins.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/cursoalumno/quizActivos',
                params: { id: ins.curso.id },
              })
            }
          >
            <Card.Title
              titleStyle={{ color: '#fff' }}
              subtitleStyle={{ color: '#e5e7eb' }}
              title={ins.curso.nombre}
              subtitle={`Código: ${ins.curso.codigo_acceso}`}
            />
            <Card.Content>
              <Text style={{ color: '#fff' }}>{ins.curso.descripcion}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
  },
  title: {
    color: '#FFDC64',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 30,
    color: '#f3f4f6',
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#1f2937',
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#10b981',
    borderRadius: 30,
    marginTop: 10,
  },
  message: {
    color: '#f3f4f6',
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#1f2937',
    marginTop: 12,
    borderRadius: 12,
    padding: 4,
  },
});