import { obtenerPreguntasPorQuiz, obtenerRespuestasDeAlumno, verificarRespuesta } from '@/apis/apiQuizz';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

interface Pregunta {
  id: string;
  texto: string;
  opciones: string[];
  respuesta_correcta: number;
  tema: string;
  explicacion: string;
}

export default function QuizPlayer() {
  const { quizId } = useLocalSearchParams();
  const router = useRouter();
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respuestasUsuario, setRespuestasUsuario] = useState<{ seleccionada: number, esCorrecta: boolean }[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [alumnoId, setAlumnoId] = useState<string | null>(null);

  useEffect(() => {
    const checkSiYaRespondio = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        const storedAlumnoId = await SecureStore.getItemAsync('alumnoId');

        setToken(storedToken);
        setAlumnoId(storedAlumnoId);

        if (!storedToken || !storedAlumnoId) return;

        const result = await verificarRespuesta(quizId as string, storedAlumnoId as string);

        if (result.respondido) {
          const preguntas = await obtenerPreguntasPorQuiz(quizId as string, storedToken);
          const respuestas = await obtenerRespuestasDeAlumno(quizId as string, storedAlumnoId, storedToken);

          router.replace({
            pathname: '/cursoalumno/CorreccionQuiz',
            params: {
              quizId: quizId as string,
              alumnoId: storedAlumnoId || '',
              token: storedToken || '',
              preguntas: JSON.stringify(preguntas),
              respuestasUsuario: JSON.stringify(respuestas.preguntas),
              puntuacion: respuestas.puntuacion?.toString(),
              total: respuestas.total?.toString()
            }
          });
        }
      } catch (error) {
        console.error('❌ Error en verificación:', error);
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

  const handleEnviarRespuesta = async () => {
    if (respuestaSeleccionada !== null) {
      const pregunta = preguntas[preguntaActual];
      const esCorrecta = respuestaSeleccionada === pregunta.respuesta_correcta;
      const nuevasRespuestas = [...respuestasUsuario, { seleccionada: respuestaSeleccionada, esCorrecta }];

      if (preguntaActual < preguntas.length - 1) {
        setPreguntaActual(preguntaActual + 1);
        setRespuestaSeleccionada(null);
        setRespuestasUsuario(nuevasRespuestas);
      } else {
        const token = await SecureStore.getItemAsync('token');
        const alumnoId = await SecureStore.getItemAsync('alumnoId');

        router.replace({
          pathname: '/cursoalumno/CorreccionQuiz',
          params: {
            preguntas: JSON.stringify(preguntas),
            respuestasUsuario: JSON.stringify(nuevasRespuestas),
            quizId: quizId as string,
            alumnoId: alumnoId || '',
            token: token || '',
          }
        });
      }
    }
  };

  if (cargando) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  if (error) {
    return <Text style={{ color: '#f87171', margin: 20 }}>{error}</Text>;
  }

  if (!preguntas.length) {
    return <Text style={{ margin: 20, color: '#f3f4f6' }}>No hay preguntas disponibles.</Text>;
  }

  const pregunta = preguntas[preguntaActual];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.titulo}>{pregunta.texto}</Text>
        </Card.Content>
      </Card>

      {pregunta.opciones.map((opcion: string, i: number) => {
        const isSelected = respuestaSeleccionada === i;
        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.botonOpcion,
              isSelected && styles.botonSeleccionado
            ]}
            onPress={() => handleSeleccionarRespuesta(i)}
            disabled={respuestaSeleccionada !== null}
            activeOpacity={0.85}
          >
            <Text style={[
              styles.textoOpcion,
              isSelected && styles.textoSeleccionado
            ]}>
              {opcion}
            </Text>
          </TouchableOpacity>
        );
      })}

      <Button
        mode="contained"
        onPress={handleEnviarRespuesta}
        disabled={respuestaSeleccionada === null}
        style={styles.botonEnviar}
        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
      >
        Enviar
      </Button>

      <Text style={styles.contador}>
        Pregunta {preguntaActual + 1} de {preguntas.length}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1e3c72',
    minHeight: '100%',
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#1f2937',
    borderRadius: 10,
  },
  titulo: {
    fontSize: 20,
    marginBottom: 12,
    color: '#f9fafb',
    fontWeight: 'bold',
  },
  botonOpcion: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#6b7280',
  },
  botonSeleccionado: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  textoOpcion: {
    color: '#e5e7eb',
    fontSize: 16,
  },
  textoSeleccionado: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botonEnviar: {
    marginTop: 24,
    backgroundColor: '#10b981',
    borderRadius: 30,
  },
  contador: {
    marginTop: 20,
    color: '#e5e7eb',
    textAlign: 'center',
    fontSize: 14,
  },
});