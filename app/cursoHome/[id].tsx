// app/cursohome/[id].tsx
import { getQuizzesByCursoId } from '@/apis/apiQuizz';
import { getTokenFromStorage } from '@/utils/auth'; // Asegúrate que tienes esta utilidad o reemplaza por tu método
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

interface Quiz {
  id: number;
  titulo: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export default function CursoAlumnoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = await getTokenFromStorage(); // asegúrate de usar tu método real
      const allQuizzes = await getQuizzesByCursoId(Number(id), token);
      const hoy = dayjs();
      const activos = allQuizzes.filter((quiz: Quiz) =>
        hoy.isAfter(dayjs(quiz.fecha_inicio)) && hoy.isBefore(dayjs(quiz.fecha_fin))
      );
      setQuizzes(activos);
    };

    fetchQuizzes();
  }, []);

  const resolverQuiz = (quizId: number) => {
    router.push(`../ResolverPreguntasScreen?id=${quizId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quizzes Activos</Text>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.quizCard}>
            <Text style={styles.quizTitle}>{item.titulo}</Text>
            <Pressable onPress={() => resolverQuiz(item.id)} style={styles.button}>
              <Text style={styles.buttonText}>Resolver quiz</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text>No hay quizzes activos</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  quizCard: { backgroundColor: '#f0f0f0', padding: 16, marginBottom: 12, borderRadius: 8 },
  quizTitle: { fontSize: 18, fontWeight: '600' },
  button: { marginTop: 10, backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
});