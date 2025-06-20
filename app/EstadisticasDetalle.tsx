import { obtenerEstadisticasDelQuiz } from '@/apis/apiQuizz';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface Estadisticas {
  total_alumnos: number;
  promedio_puntuacion: number;
  preguntas_problematicas: { pregunta: string; total_errores: number }[];
}

export default function EstadisticasDetalle() {
  const { quizId } = useLocalSearchParams();
  const [stats, setStats] = useState<Estadisticas | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (!token || !quizId) return;
      const data = await obtenerEstadisticasDelQuiz(quizId.toString(), token);
      setStats(data);
    };
    fetchStats();
  }, [quizId]);

  if (!stats) return <Text style={{ color: 'white', padding: 20 }}>Cargando estadísticas...</Text>;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Estadísticas del Quiz</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>👨‍🎓 Total alumnos</Text>
        <Text style={styles.cardValue}>{stats.total_alumnos}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Promedio de puntuación</Text>
        <Text style={styles.cardValue}>{stats.promedio_puntuacion.toFixed(2)}</Text>
      </View>

      <Text style={styles.section}>❗ Preguntas problemáticas</Text>

      {stats.preguntas_problematicas.length === 0 ? (
        <Text style={styles.noIssues}>✅ No hay preguntas con errores frecuentes.</Text>
      ) : (
        stats.preguntas_problematicas.map((p, i) => (
          <View key={i} style={styles.questionItem}>
            <Text style={styles.questionText}>• {p.pregunta}</Text>
            <Text style={styles.errorCount}>Errores: {p.total_errores}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#1e3c72',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1e3c72',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFDC64',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    fontSize: 18,
    color: '#fbbf24',
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  noIssues: {
    color: '#a7f3d0',
    fontStyle: 'italic',
  },
  questionItem: {
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  questionText: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 4,
  },
  errorCount: {
    color: '#f87171',
    fontSize: 13,
  },
});