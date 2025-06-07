import { crearQuizz, generarPreguntasConIA } from '@/apis/apiQuizz';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

// Importamos el DateTimePicker de la librería de comunidad
// Nota: Asegúrate de instalar @react-native-community/datetimepicker si lo necesitas 
//npx expo install @react-native-community/datetimepicker


import DateTimePickerModal from 'react-native-modal-datetime-picker';




const now = new Date();
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

// Formato tipo: '2025-05-27T15:00'
function formatDate(date: Date) {
  return date.toISOString().slice(0, 16); // formato YYYY-MM-DDTHH:mm
}

interface CrearQuizzProps {
  cursoId: number;
}

export default function CrearQuizz({ cursoId }: CrearQuizzProps) {
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.preguntasIds) setPreguntas(JSON.parse(params.preguntasIds as string));
    if (params.titulo) setTitulo(params.titulo as string);
    if (params.tema) setTema(params.tema as string);
    if (params.fechaInicio) setFechaInicio(params.fechaInicio as string);
    if (params.fechaFin) setFechaFin(params.fechaFin as string);
  }, []);

  const [titulo, setTitulo] = useState('');
  const [tema, setTema] = useState('');
  const [cantidad, setCantidad] = useState('5');
  const [fechaInicio, setFechaInicio] = useState(formatDate(now));
  const [fechaFin, setFechaFin] = useState(formatDate(oneHourLater));
  const [preguntas, setPreguntas] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState('');


// Estados para el DateTimePicker
// Modal DateTimePicker
  const [isInicioPickerVisible, setInicioPickerVisible] = useState(false);
  const [isFinPickerVisible, setFinPickerVisible] = useState(false);

  const handleConfirmInicio = (date: Date) => {
    setFechaInicio(formatDate(date));
    setInicioPickerVisible(false);
  };

  const handleConfirmFin = (date: Date) => {
    setFechaFin(formatDate(date));
    setFinPickerVisible(false);
  };







  const handleGenerarPreguntas = async () => {
    try {
      const data = await generarPreguntasConIA(tema, parseInt(cantidad));
      //const textos = data.map((p: any) => p.texto); // Ajusta según tu modelo
      //setPreguntas(textos);
      router.push({
        pathname: '/VistaPreguntas',
        params: {
          preguntas: JSON.stringify(data), // Lo pasamos como string
        },
      });

    } catch (error) {
      console.error(error);
      setMensaje('Error al generar preguntas con IA');
    }
  };

const handleCrearQuizz = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (!token) throw new Error('Token no encontrado');

    // Si no hay fechas, crea por defecto: ahora + 1 hora
    const defaultInicio = fechaInicio ? new Date(fechaInicio).toISOString() : new Date().toISOString();
    const defaultFin = fechaFin ? new Date(fechaFin).toISOString() : new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const quiz = {
      titulo,
      tema,
      preguntas,
      curso_id: cursoId,
      fecha_inicio: defaultInicio,
      fecha_fin: defaultFin,
      estado: "programado"
    };

    console.log('Enviando quiz:', quiz);

    const res = await crearQuizz(quiz, token);
    if (res && 'id' in res) {
      setMensaje(`Quiz creado con ID: ${res.id}`);
    } else {
      setMensaje('Quiz creado exitosamente.');
    }
    setTitulo('');
    setTema('');
    setCantidad('5');
    setFechaInicio('');
    setFechaFin('');
    setPreguntas([]);
  } catch (error: any) {
    console.error(error?.response?.data || error);
    setMensaje('Error al crear el quiz');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge">Crear Quizz</Text>


      <TextInput label="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />

      <TextInput label="Fecha Inicio (YYYY-MM-DDTHH:mm)" value={fechaInicio} onChangeText={setFechaInicio} style={styles.input} />
      <TextInput label="Fecha Fin (YYYY-MM-DDTHH:mm)" value={fechaFin} onChangeText={setFechaFin} style={styles.input} />

      <Button mode="contained" onPress={handleCrearQuizz}>Crear Quiz</Button>
      {mensaje ? <Text style={{ marginTop: 20 }}>{mensaje}</Text> : null}



 <Button onPress={() => setInicioPickerVisible(true)} style={styles.dateButton}>
        Elegir Fecha Inicio: {fechaInicio}
      </Button>
      <DateTimePickerModal
        isVisible={isInicioPickerVisible}
        mode="datetime"
        date={new Date(fechaInicio)}
        is24Hour={true}
        onConfirm={handleConfirmInicio}
        onCancel={() => setInicioPickerVisible(false)}
      />

      <Button onPress={() => setFinPickerVisible(true)} style={styles.dateButton}>
        Elegir Fecha Fin: {fechaFin}
      </Button>
      <DateTimePickerModal
        isVisible={isFinPickerVisible}
        mode="datetime"
        date={new Date(fechaFin)}
        is24Hour={true}
        onConfirm={handleConfirmFin}
        onCancel={() => setFinPickerVisible(false)}
      />


      <TextInput label="Tema" value={tema} onChangeText={setTema} style={styles.input} />
      <TextInput label="Cantidad de preguntas" value={cantidad} onChangeText={setCantidad} keyboardType="numeric" style={styles.input} />
      <Button mode="outlined" onPress={handleGenerarPreguntas}>Generar preguntas con IA</Button>

      {preguntas.length > 0 && (
        <>
          <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Preguntas generadas:</Text>
          {preguntas.map((p, i) => (
            <Text key={i} style={{ marginVertical: 4 }}>• {p}</Text>
          ))}
        </>
      )}





    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 12 },
  dateButton: { marginVertical: 10 },
});