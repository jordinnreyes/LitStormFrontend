import { getCursos } from '@/apis/apiCursoYCodigo';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CrearQuiz from '../CrearQuizz'; // Asegúrate de tener este screen
import EstadisticasQuiz from '../EstadisticasQuiz'; // Asegúrate de tener este screen

interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  profesor_id: number;
  codigo_acceso: string;
}

export default function CursoHome() {
  const { id } = useLocalSearchParams();
  const [curso, setCurso] = useState<Curso | null>(null);

    const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Curso', // por ejemplo agregar tu componente
    });
  }, [navigation]);

  useEffect(() => {
    const fetchCurso = async () => {
      const cursos = await getCursos();
      const cursoSeleccionado = cursos.find((c: Curso) => c.id.toString() === id);
      setCurso(cursoSeleccionado || null);
    };
    fetchCurso();
  }, []);       

  if (!curso) return <Text>Cargando...</Text>;
  return (
    <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.container}>
      <Text style={styles.title}>{curso.nombre}</Text>
      <Text style={styles.subtitle}>Código de acceso: {curso.codigo_acceso}</Text>


      <View style={{ marginTop: 15 }}>
        <CrearQuiz cursoId={curso.id} />
      </View>
    </View>

        <View style={{ marginTop: 40 }}>
  <EstadisticasQuiz cursoId={curso.id} />
</View>



</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#fff', marginLeft: 12, },
});