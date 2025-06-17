// src/components/QuizPlayer.tsx (ajusta la ruta si es necesario)

import { obtenerPreguntasPorQuiz, obtenerRespuestasDeAlumno, verificarRespuesta } from '@/apis/apiQuizz';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

interface Pregunta {
  id: string;
  texto: string;
  opciones: string[];
  respuesta_correcta: number; // ahora es un índice numérico
  tema: string;
  explicacion: string;
}

export default function QuizPlayer() {
  const theme = useTheme();
  const { quizId } = useLocalSearchParams();
  const router = useRouter();
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respuestasUsuario, setRespuestasUsuario] = useState<{seleccionada: number, esCorrecta: boolean}[]>([]);


const [token, setToken] = useState<string | null>(null);
const [alumnoId, setAlumnoId] = useState<string | null>(null);

useEffect(() => {
  const checkSiYaRespondio = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('token');
      const storedAlumnoId = await SecureStore.getItemAsync('alumnoId');

            console.log('📦 Token recuperadoo:', storedToken);
      console.log('📦 Alumno ID recuperadoo:', storedAlumnoId);

    setToken(storedToken);
    setAlumnoId(storedAlumnoId);


        if (!storedToken || !storedAlumnoId) {
      console.error("Token o alumnoId no encontrados");
      return;
    }
      const result = await verificarRespuesta(quizId as string, storedAlumnoId as string);

      console.log('✅ Resultado verificación:', result);
      if (result.respondido) {

console.log('🟢 Intentando obtener preguntas del quiz:', quizId, storedToken);
    const preguntas = await obtenerPreguntasPorQuiz(quizId as string, storedToken);
    console.log('✅ Preguntas obtenidas:', preguntas);

    console.log('🟢 Intentando obtener respuestas del alumno:', quizId, storedAlumnoId);
    const respuestas = await obtenerRespuestasDeAlumno(quizId as string, storedAlumnoId, storedToken);
    console.log('✅ Respuestas del alumno obtenidas:', respuestas);

    //setRespuestasUsuario(respuestas.preguntas); // Solo si deseas guardarlas en el estado también


        // Redirige directamente a CorreccionQuiz
        router.replace({
          pathname: '/cursoalumno/CorreccionQuiz',
          params: {
          quizId: quizId as string,
          alumnoId: storedAlumnoId || '',
          token: storedToken || '',
          // podrías pasar preguntas/respuestas guardadas si ya las tienes
          preguntas: JSON.stringify(preguntas),
          respuestasUsuario: JSON.stringify(respuestas.preguntas), // ✅ esto sí es correcto
          puntuacion: respuestas.puntuacion?.toString(),
          total: respuestas.total?.toString()
          }
        });
      }
    } catch (error) {
        if (error instanceof Error) {
    console.error('❌ Error (tipo Error):', error.message);
  } else {
    console.error('❌ Error desconocido:', error);
  }
    }
  };

  if (quizId) checkSiYaRespondio();
}, [quizId]);






  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          setError('Token no encontrado');
          setCargando(false);
          return;
        }



        
  const alumnoId = await SecureStore.getItemAsync('alumnoId'); // si lo guardaste así



        const data = await obtenerPreguntasPorQuiz(quizId as string, token);
        setPreguntas(data);
        setCargando(false);
      } catch (err) {
        setError('Error al cargar las preguntas');
        setCargando(false);
      }
    };

    fetchPreguntas();
  }, [quizId]);

  const handleSeleccionarRespuesta = (indice: number) => {
    setRespuestaSeleccionada(indice);
  };

  const handleEnviarRespuesta = async  () => {
    if (respuestaSeleccionada !== null) {
      const pregunta = preguntas[preguntaActual];
      const esCorrecta = respuestaSeleccionada === pregunta.respuesta_correcta;
      //setRespuestasUsuario(prev => [...prev, { seleccionada: respuestaSeleccionada, esCorrecta }]);
const nuevasRespuestas = [...respuestasUsuario, { seleccionada: respuestaSeleccionada, esCorrecta }];

      if (preguntaActual < preguntas.length - 1) {
        setPreguntaActual(preguntaActual + 1);
        setRespuestaSeleccionada(null);

        setRespuestasUsuario(nuevasRespuestas);

      } else {
      // 🔽 Recupera el token y alumnoId directamente aquí
      const token = await SecureStore.getItemAsync('token');
      const alumnoId = await SecureStore.getItemAsync('alumnoId');
      console.log("🧪 Envío final - token:", token);
      console.log("🧪 Envío final - alumnoId:", alumnoId);
        
        // Navegar a CorreccionQuiz pasando preguntas y respuestasUsuario
        router.replace({ 
          pathname: '/cursoalumno/CorreccionQuiz', 
          params: { preguntas: JSON.stringify(preguntas),
             //respuestasUsuario: JSON.stringify([...respuestasUsuario, { seleccionada: respuestaSeleccionada, esCorrecta }]), 
             respuestasUsuario: JSON.stringify(nuevasRespuestas),
             quizId: quizId as string,
    alumnoId: alumnoId || '',
    token: token || '',       } });
      }
    }
  };

  if (cargando) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  if (error) {
    return <Text style={{ color: theme.colors.error, margin: 20 }}>{error}</Text>;
  }

  if (!preguntas.length) {
    return <Text style={{ margin: 20, color: theme.colors.onSurface }}>No hay preguntas disponibles.</Text>;
  }

  const pregunta = preguntas[preguntaActual];

  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}> 
      <Card style={{ marginBottom: 20, backgroundColor: theme.colors.elevation.level1 }}>
        <Card.Content>
          <Text variant="titleLarge" style={[styles.titulo, {color: theme.colors.onSurface}]}>{pregunta.texto}</Text>
        </Card.Content>
      </Card>
      {pregunta.opciones.map((opcion: string, i: number) => {
        const isSelected = respuestaSeleccionada === i;
        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.botonOpcion,
              {
                backgroundColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.elevation.level2,
                borderColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.outlineVariant,
              }
            ]}
            onPress={() => handleSeleccionarRespuesta(i)}
            disabled={respuestaSeleccionada !== null}
            activeOpacity={0.85}
          >
            <Text style={{
              color: isSelected
                ? theme.colors.onPrimary
                : theme.colors.onSurface,
              fontWeight: isSelected ? 'bold' : 'normal',
              fontSize: 16,
            }}>{opcion}</Text>
          </TouchableOpacity>
        );
      })}
      <Button
        mode="contained"
        onPress={handleEnviarRespuesta}
        disabled={respuestaSeleccionada === null}
        style={{ marginTop: 24 }}
      >
        Enviar
      </Button>
      <Text style={{ marginTop: 20, color: theme.colors.onSurface, textAlign: 'center' }}>
        Pregunta {preguntaActual + 1} de {preguntas.length}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  titulo: { fontSize: 20, marginBottom: 12 },
  botonOpcion: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  botonSeleccionado: {
    
  },
});
