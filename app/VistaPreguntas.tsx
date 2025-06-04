import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function VistaPreguntas() {
  const { preguntas } = useLocalSearchParams();
  const preguntasArray: string[] = Array.isArray(preguntas)
    ? preguntas
    : JSON.parse(preguntas || '[]');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Preguntas Generadas
      </Text>
      {preguntasArray.map((pregunta, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.preguntaTexto}>{`Pregunta ${index + 1}`}</Text>
          <Text style={styles.preguntaContenido}>{pregunta}</Text>
          <View style={styles.pickerWrapper}>
            <Picker style={styles.picker}>
              <Picker.Item label="Selecciona una respuesta" value="" />
              <Picker.Item label="Opción 1" value="1" />
              <Picker.Item label="Opción 2" value="2" />
              <Picker.Item label="Opción 3" value="3" />
              <Picker.Item label="Opción 4" value="4" />
            </Picker>
          </View>
        </View>
      ))}
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    backgroundColor: '#f2f2f2',
  },
});
