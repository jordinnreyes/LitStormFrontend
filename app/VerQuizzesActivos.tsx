// components/VerQuizzesActivos.tsx
import { getQuizzesByCursoIdActivo } from '@/apis/apiQuizz';
import { useAuth } from '@/context/AuthContext';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  cursoId: number;
}

interface Quiz {
  id: number;
  titulo: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export default function VerQuizzesActivos({ cursoId }: Props) {
  const { token } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  
  console.log('🧠 ID del curso recibido:', cursoId); // en el componente


  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!token) return;

      try {
        const allQuizzes = await getQuizzesByCursoIdActivo(cursoId, token);
        const hoy = dayjs();

        const activos = allQuizzes.filter((quiz: Quiz) =>
          hoy.isAfter(dayjs(quiz.fecha_inicio)) && hoy.isBefore(dayjs(quiz.fecha_fin))
        );

        setQuizzes(activos);
      } catch (error) {
        console.error('Error al cargar quizzes:', error);
      }
    };

    fetchQuizzes();
  }, [cursoId, token]);

  const resolverQuiz = (quizId: number) => {
    router.push(`/ResolverPreguntasScreen?id=${quizId}`);
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
