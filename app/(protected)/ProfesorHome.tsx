import { crearCurso, getMisInscripciones } from '@/apis/apiCursoYCodigo';
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

export interface Inscripcion {
  id: number;
  curso: Curso;
}

export default function ProfesorHome() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cursos, setCursos] = useState<Curso[]>([]);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Inicio Profesor',
      headerRight: () => <TopBarUser />,
      headerBackVisible: false,
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Confirmar salida",
          "¿Querés cerrar sesión y salir?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Salir", onPress: () => {
                SecureStore.deleteItemAsync('token');
                BackHandler.exitApp();
              }
            },
          ]
        );
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const fetchCursos = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (!token) return;
    const inscripciones = await getMisInscripciones(token);
    const cursosDelProfesor = inscripciones.map((insc) => insc.curso);
    setCursos(cursosDelProfesor);
  };

  const handleCrearCurso = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('No se encontró token');
      await crearCurso({ nombre, descripcion }, token);
      setNombre('');
      setDescripcion('');
      fetchCursos();
    } catch (error) {
      console.error(error);
      setMensaje('Error al crear el curso');
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  return (
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text variant="displayMedium" style={styles.title}>Crear Curso</Text>

        <TextInput
          label="Nombre del curso"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { text: '#fff', primary: '#3b82f6', placeholder: '#ccc' } }}
        />
        <TextInput
          label="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { text: '#fff', primary: '#3b82f6', placeholder: '#ccc' } }}
        />

        <Button
          mode="contained"
          onPress={handleCrearCurso}
          style={styles.button}
          contentStyle={{ paddingVertical: 10 }}
          labelStyle={{ color: '#fff', fontWeight: 'bold' }}
        >
          Crear curso
        </Button>

        {mensaje ? <Text style={styles.error}>{mensaje}</Text> : null}

        <Text variant="titleMedium" style={styles.subtitle}>Cursos existentes:</Text>

        {cursos.map((curso) => (
          <Card
            key={curso.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '../cursoHome/[id]', params: { id: curso.id.toString() } })}
          >
            <Card.Title
              titleStyle={{ color: '#fff' }}
              subtitleStyle={{ color: '#e5e7eb' }}
              title={curso.nombre}
              subtitle={`Código: ${curso.codigo_acceso}`}
            />
            <Card.Content>
              <Text style={{ color: '#fff' }}>{curso.descripcion}</Text>
              <Text style={{ color: '#fff', marginTop: 5 }}>Ver curso</Text>
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
  error: {
    color: '#f87171',
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