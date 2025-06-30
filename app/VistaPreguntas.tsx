import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { guardarPreguntasSeleccionadas } from '../apis/apiQuizz';
import { useAuth } from '../context/AuthContext';

type Pregunta = {
  texto: string;
  opciones: string[];
  respuesta_correcta: number;
  explicacion: string;
  tema: string;
  curso_id: number;
};

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  isLoading: boolean;
};

export default function VistaPreguntas() {
  const { preguntas, titulo, tema, cursoId } = useLocalSearchParams();
  const preguntasArray: Pregunta[] = Array.isArray(preguntas)
    ? preguntas
    : JSON.parse(preguntas || '[]');

  // Parsear los parámetros con valores por defecto
  const tituloQuiz = typeof titulo === 'string' ? titulo : 'Nuevo Quiz';
  const temaQuiz = typeof tema === 'string' ? tema : 'General';
  const cursoIdNum = typeof cursoId === 'string' ? parseInt(cursoId) : 1;

  // asegúrate que tienes acceso al token desde contexto
  const { token } = useAuth(); // ya tienes acceso al token
  const [insertedIds, setInsertedIds] = useState<string[]>([]);

  console.log("🧪 Token actual en VistaPreguntas:", token); // 👈 log para comprobar

  const handleGuardarPreguntas = async () => {
    if (!token) {
      Alert.alert('Error', 'No se ha iniciado sesión. Inicia sesión para guardar las preguntas.');
      return;
    }

    // Usamos el cursoId que recibimos como parámetro
    const preguntasConCurso = preguntasArray.map(p => ({
      ...p,
      curso_id: cursoIdNum,
    }));

    try {
      console.log("📦 Enviando preguntas:", preguntasConCurso); // debug opcional
      const response = await guardarPreguntasSeleccionadas(preguntasConCurso, token);
      Alert.alert('Éxito', 'Las preguntas fueron guardadas correctamente');
      console.log('IDs insertados:', response);
      setInsertedIds(response as string[]);

      // Reenviar al formulario con los datos e IDs insertados
      router.replace({
        pathname: '../CrearQuizz',
        params: {
          preguntasIds: JSON.stringify(response),
          preguntas: JSON.stringify(preguntasArray),
          cursoId: cursoIdNum.toString(),
          titulo: tituloQuiz,
          tema: temaQuiz,
          fechaInicio: new Date().toISOString(),
          fechaFin: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        },
      });
    } catch (error: any) {
      console.error('Error al guardar preguntas:', error);
      Alert.alert('Error', 'No se pudieron guardar las preguntas');
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Preguntas Generadas
      </Text>
      {preguntasArray.map((pregunta, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.preguntaTexto}>{`Pregunta ${index + 1}`}</Text>
          <Text style={styles.preguntaContenido}>{pregunta.texto}</Text>

          {pregunta.opciones.map((opcion, i) => (
            <Text
              key={i}
              style={[
                styles.opcion,
                i === pregunta.respuesta_correcta && styles.opcionCorrecta,
              ]}
            >
              {`• ${opcion}`}
            </Text>
          ))}

          <Text style={styles.explicacionTitulo}>Explicación:</Text>
          <Text style={styles.explicacionTexto}>{pregunta.explicacion}</Text>
        </View>
      ))}


        <Button mode="contained"
        onPress={handleGuardarPreguntas}
        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
        style={styles.botonGuardar}
      >
        Guardar preguntas
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1e3c72',
    minHeight: '100%',
    paddingBottom: 120, 
  },
  title: {
    marginBottom: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    color: '#FFDC64',
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  preguntaTexto: {
    fontSize: 17,
    fontWeight: '700',
    color: '#f3f4f6',
    marginBottom: 10,
  },
  preguntaContenido: {
    fontSize: 14,
    marginBottom: 12,
    color: '#e5e7eb',
  },
  opcion: {
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
    borderRadius: 6,
    backgroundColor: '#374151',
    color: '#f3f4f6',
  },
  opcionCorrecta: {
    backgroundColor: '#10b981',
    color: '#fff',
    fontWeight: 'bold',
  },
  explicacionTitulo: {
    marginTop: 12,
    fontWeight: '600',
    color: '#a1a1aa',
  },
  explicacionTexto: {
    fontSize: 13,
    color: '#d1d5db',
  },
  botonGuardar: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#10b981',
  },
});