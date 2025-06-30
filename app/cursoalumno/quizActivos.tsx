import { obtenerPreguntasPorQuiz, obtenerQuizzesActivosProgramados, obtenerRespuestasDeAlumno, verificarRespuesta, } from '@/apis/apiQuizz';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';


interface Quiz {
  id: string;
  titulo: string;
  tema: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

export default function QuizActivos() {
  const { id } = useLocalSearchParams(); // curso_id
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [quizzesRespondidos, setQuizzesRespondidos] = useState<{ [quizId: string]: boolean }>({});

  const cursoId = parseInt(id as string);

  useEffect(() => {
    const verificarTodos = async () => {
      const token = await SecureStore.getItemAsync('token');
      const alumnoId = await SecureStore.getItemAsync('alumnoId');
      const estados: { [quizId: string]: boolean } = {};

      for (const quiz of quizzes) {
        try {
          const resp = await verificarRespuesta(quiz.id, alumnoId as string);
          estados[quiz.id] = resp.respondido;
        } catch (error) {
          estados[quiz.id] = false; // fallback
          console.error('Error verificando respuesta de quiz:', quiz.id, error);
        }
      }

      setQuizzesRespondidos(estados);
    };

    if (quizzes.length > 0) {
      verificarTodos();
    }
  }, [quizzes]);


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        if (!storedToken) {
          console.warn('Token no encontrado');
          return;
        }

        const quizzes = await obtenerQuizzesActivosProgramados(cursoId, storedToken);
        setQuizzes(quizzes);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // No hay quizzes activos programados
          setQuizzes([]); // explícitamente vacío
        } else {
          console.error('Error al obtener quizzes activos:', error);
        }
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quizzes Activos</Text>
      {quizzes.length === 0 && (
        <Text style={styles.emptyText}>No hay quizzes activos por el momento 📭</Text>
      )}

      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.quizTitle}>{item.titulo}</Text>
              <Text style={styles.subTitle}>{item.id}</Text>
              <Text style={styles.tema}>{item.tema}</Text>
            </Card.Content>
            <Card.Actions>
              {quizzesRespondidos[item.id] ? (
                <Button
                  mode="outlined"
                  onPress={async () => {
                    const storedToken = await SecureStore.getItemAsync('token');
                    const storedAlumnoId = await SecureStore.getItemAsync('alumnoId');

                    if (!storedToken || !storedAlumnoId) {
                      alert("Token o ID de alumno no disponibles");
                      return;
                    }

                    try {
                      const preguntas = await obtenerPreguntasPorQuiz(item.id, storedToken);
                      const respuestas = await obtenerRespuestasDeAlumno(item.id, storedAlumnoId, storedToken);

                      router.push({
                        pathname: "./CorreccionQuiz",
                        params: {
                          quizId: item.id,
                          alumnoId: storedAlumnoId,
                          token: storedToken,
                          preguntas: JSON.stringify(preguntas),
                          respuestasUsuario: JSON.stringify(respuestas.preguntas),
                          puntuacion: respuestas.puntuacion?.toString(),
                          total: respuestas.total?.toString()
                        }
                      });
                    } catch (error) {
                      console.error("❌ Error al obtener datos para corrección:", error);
                      alert("No se pudo cargar la corrección");
                    }
                  }}
                  style={{ borderColor: '#10b981' }}
                  labelStyle={{ color: '#10b981' }}
                >
                  Ver corrección
                </Button>
              ) : (
                <Button
                  mode="contained"
                  onPress={() => {
                    const fechaInicio = new Date(item.fecha_inicio);
                    const ahora = new Date();

                    if (ahora < fechaInicio) {
                      alert("⏳ El quiz aún no está disponible. Intenta más tarde.");
                      return;
                    }

                    router.push({
                      pathname: "./QuizPlayer",
                      params: { quizId: item.id },
                    });
                  }}
                  style={styles.button}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                >
                  Resolver quiz
                </Button>
              )}

            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#1e3c72',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FFDC64',
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  quizTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
    color: '#fff',
  },
  subTitle: {
    fontSize: 13,
    marginBottom: 2,
    color: '#e5e7eb',
  },
  tema: {
    color: '#f3f4f6',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#10b981',
    borderRadius: 30,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
  }
});