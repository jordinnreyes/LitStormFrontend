import { obtenerQuizzesPorCurso, QuizResumen } from '@/apis/apiQuizz';
import { useLocalSearchParams, useRouter } from 'expo-router'; // 👈 import
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EstadisticasQuiz() {
  const [quizzes, setQuizzes] = useState<QuizResumen[]>([]);
  const router = useRouter(); // 👈 hook de navegación

    const { id } = useLocalSearchParams();
  const cursoId = parseInt(id as string);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (!token) return;
      const data = await obtenerQuizzesPorCurso(cursoId, token);
      setQuizzes(data);
    };
    fetchQuizzes();
  }, [cursoId]);

  const irAEstaEstadistica = (quizId: string) => {
    router.push({
      pathname: '/EstadisticasDetalle',
      params: { quizId }, // 👈 pasas el ID
    });
  };

  return (
    <ScrollView   style={{ backgroundColor: '#1e3c72' }}
  contentContainerStyle={{ ...styles.container, flexGrow: 1 }}>
      <Text style={styles.title}>Estadísticas de Quizzes</Text>
      {quizzes.map((quiz) => (
        <View key={quiz.id} style={styles.quizCard}>
          <Text style={styles.quizTitle}>{quiz.titulo}</Text>
          <Button title="Ver estadísticas" onPress={() => irAEstaEstadistica(quiz.id)} color="#10b981" />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFDC64',
    marginBottom: 20,
    textAlign: 'center',
  },
  quizCard: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f3f4f6',
    marginBottom: 10,
  },
});
