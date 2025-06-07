import type { Pregunta } from '@/apis/apiQuizz';
import { getPreguntasPorQuiz } from '@/apis/apiQuizz';
import { getTokenFromStorage } from '@/utils/auth';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ResolverPreguntasScreen() {
  const { id } = useLocalSearchParams(); // quiz ID
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<{ [preguntaId: number]: string }>({});

  useEffect(() => {
    const fetchPreguntas = async () => {
      const token = await getTokenFromStorage();
      const data = await getPreguntasPorQuiz(Number(id), token);
      setPreguntas(data);
    };
    fetchPreguntas();
  }, []);

  const seleccionarRespuesta = (preguntaId: number, opcion: string) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: opcion,
    }));
  };

  const enviarRespuestas = () => {
    console.log('Respuestas seleccionadas:', respuestas);
    Alert.alert('Enviado', 'Tus respuestas fueron registradas.');
    // Aquí puedes hacer un POST al backend si lo deseas
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preguntas del Quiz</Text>
      <FlatList
        data={preguntas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.pregunta}>{item.contenido}</Text>
            {item.opciones.map((opcion, index) => (
              <Pressable
                key={index}
                onPress={() => seleccionarRespuesta(item.id, opcion)}
                style={[
                  styles.opcion,
                  respuestas[item.id] === opcion && styles.opcionSeleccionada,
                ]}
              >
                <Text style={styles.opcionTexto}>{opcion}</Text>
              </Pressable>
            ))}
          </View>
        )}
      />
      <Pressable style={styles.botonEnviar} onPress={enviarRespuestas}>
        <Text style={styles.textoEnviar}>Enviar Respuestas</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { marginBottom: 20, padding: 15, backgroundColor: '#f2f2f2', borderRadius: 10 },
  pregunta: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  opcion: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
    borderRadius: 5,
  },
  opcionSeleccionada: {
    backgroundColor: '#4CAF50',
  },
  opcionTexto: { color: '#000' },
  botonEnviar: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  textoEnviar: {
    color: '#fff',
    fontWeight: 'bold',
  },
});