import { obtenerQuizzesActivosProgramados } from '@/apis/apiQuizz';
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
  const cursoId = parseInt(id as string);

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
      } catch (error) {
        console.error('Error al obtener quizzes activos:', error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quizzes Activos</Text>
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
              <Button
                mode="contained"
                onPress={() => {
                  const fechaInicio = new Date(item.fecha_inicio);
                  const ahora = new Date();

                  if (ahora < fechaInicio) {
                    alert("⏳ El quiz aún no está disponible. Intenta más tarde.");
                    return;
                  }

                  router.push({ pathname: "./QuizPlayer", params: { quizId: item.id } });
                }}
                style={styles.button}
                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              >
                Resolver quiz
              </Button>
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
});