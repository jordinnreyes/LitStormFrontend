import { getCursos } from '@/apis/apiCursoYCodigo';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import CrearQuiz from '../CrearQuizz';
//import EstadisticasQuiz from '../EstadisticasQuiz';
import { TouchableOpacity } from 'react-native';

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
      const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Curso', 
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

  if (!curso)   return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e3c72' }}>
      <Text style={{ color: '#fff', fontSize: 18 }}>Cargando curso...</Text>
    </View>
  );
  return (



      <View style={styles.container}>
              <Text style={styles.title}>{curso.nombre}</Text>
      <Text style={styles.subtitle}>Código de acceso: {curso.codigo_acceso}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ pathname: '/CrearQuizz', params: { id: curso.id } })}
      >
        <Text style={styles.buttonText}>➕ Crear Quiz</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#3b82f6' }]}
        onPress={() => router.push({ pathname: '/EstadisticasQuiz', params: { id: curso.id } })}
      >
        <Text style={styles.buttonText}>📊 Ver Estadísticas</Text>
      </TouchableOpacity>

      </View>


/*
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

*/
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#1e3c72',},
  title: { 
        fontSize: 24,
    fontWeight: 'bold',
    color: '#FFDC64',
    marginBottom: 10,
    textAlign: 'center', },
  subtitle: {     fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,},

    button: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});