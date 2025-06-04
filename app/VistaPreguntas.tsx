import { useLocalSearchParams } from 'expo-router';
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
};

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  isLoading: boolean;
};


export default function VistaPreguntas() {
  const { preguntas } = useLocalSearchParams();
  const preguntasArray: Pregunta[] = Array.isArray(preguntas)
    ? preguntas
    : JSON.parse(preguntas || '[]');


    // asegúrate que tienes acceso al token desde contexto
    const { token } = useAuth(); // ya tienes acceso al token

console.log("🧪 Token actual en VistaPreguntas:", token); // 👈 log para comprobar

    const handleGuardarPreguntas = async () => {

    if (!token) {
    Alert.alert('Error', 'No se ha iniciado sesión. Inicia sesión para guardar las preguntas.');
    return;
    }
    try {
      const response = await guardarPreguntasSeleccionadas(preguntasArray, token);
      Alert.alert('Éxito', 'Las preguntas fueron guardadas correctamente');
      console.log('IDs insertados:', response);
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
    paddingBottom: 40,
    backgroundColor: '#f9f9f9',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  preguntaTexto: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  preguntaContenido: {
    fontSize: 14,
    marginBottom: 12,
    color: '#555',
  },
 opcion: {
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
    color: '#333',
  },
  opcionCorrecta: {
    backgroundColor: '#d1e7dd',
    color: '#0f5132',
    fontWeight: 'bold',
  },
  explicacionTitulo: {
    marginTop: 12,
    fontWeight: '600',
    color: '#555',
  },
  explicacionTexto: {
    fontSize: 13,
    color: '#444',
  },
    botonGuardar: {
    marginTop: 20,
    alignSelf: 'center',
  },
});
