import { crearCurso, getMisInscripciones } from '@/apis/apiCursoYCodigo';
import TopBarUser from '@/components/TopBarUser';
import { useFocusEffect } from '@react-navigation/native';
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
      headerRight: () => <TopBarUser />, // por ejemplo agregar tu componente
       //headerLeft: () => null,       // <-- oculta la flecha de back
    // o alternativamente (en RN >= 6.x)
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
            { text: "Salir", onPress: () => {
                // Opcional: limpiar token y salir app
                SecureStore.deleteItemAsync('token');
                BackHandler.exitApp();
            }},
          ]
        );
        return true; // Bloquea acción por defecto
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
      //await inscribirseCurso(codigoAccesoDelCurso, token); // si puedes obtener el código
      //const curso = await crearCurso({ nombre, descripcion }, token);
      //setMensaje(`Curso creado con código: ${curso.codigo}`);
      setNombre('');
      setDescripcion('');
      fetchCursos(); // actualizar lista
 

    } catch (error) {
      console.error(error);
      setMensaje('Error al crear el curso');
    }
  };

    useEffect(() => {
    fetchCursos();
  }, []);

  return (
    <>

    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge">Crear Curso</Text>
      <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput label="Descripción" value={descripcion} onChangeText={setDescripcion} style={styles.input} />
      <Button mode="contained" onPress={handleCrearCurso}>Crear Curso</Button>
      {mensaje ? <Text style={{ marginTop: 20 }}>{mensaje}</Text> : null}


      <Text variant="titleMedium" style={{ marginTop: 30, color: 'gray' }}>Cursos existentes:</Text>
      {cursos.map((curso) => (


        <Card 
          key={curso.id} 
          style={{ marginTop: 10 }}
          onPress={() => router.push({ pathname: '../cursoHome/[id]', params: { id: curso.id.toString() } })}

          >

          <Card.Title title={curso.id + " - " + curso.nombre} subtitle={`Código: ${curso.codigo_acceso}`} />
          <Card.Content>
            <Text>{curso.descripcion}</Text>
            <Text style={{ color: 'blue', marginTop: 5 }}>Ver curso</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 12 }
});