import { evaluarQuiz } from '@/apis/apiQuizz';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

interface Pregunta {
  id: string;
  texto: string;
  opciones: string[];
  respuesta_correcta: number;
  tema: string;
  explicacion: string;
}

interface RespuestaUsuario {
  seleccionada: number;
  esCorrecta: boolean;
}

export interface ResultadoPregunta {
  texto: string;
  correcta: boolean;
  respuesta_usuario: string;
  respuesta_correcta: string;
  explicacion: string;
  feedback_ia?: string;
}

export default function CorreccionQuiz() {
  const params = useLocalSearchParams();

  const preguntasArr: Pregunta[] = params.preguntas ? JSON.parse(params.preguntas as string) : [];
  const respuestasArr: RespuestaUsuario[] = params.respuestasUsuario ? JSON.parse(params.respuestasUsuario as string) : [];

  const quizIdStr = typeof params.quizId === 'string' ? params.quizId : '';
  const alumnoIdStr = typeof params.alumnoId === 'string' ? params.alumnoId : '';
  const tokenStr = typeof params.token === 'string' ? params.token : '';


  const [mostrarFeedback, setMostrarFeedback] = useState(false);

  const correctas = params.puntuacion
    ? parseInt(params.puntuacion as string)
    : respuestasArr.filter((r) => r.esCorrecta).length;

  const total = params.total ? parseInt(params.total as string) : preguntasArr.length;

  const respuestas = preguntasArr.map((pregunta, index) => ({
    pregunta_id: pregunta.id,
    respuesta: parseInt(String(respuestasArr[index]?.seleccionada ?? '-1'), 10),
  }));

  const [resultado, setResultado] = useState<{
    detalle: ResultadoPregunta[];
    puntuacion: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    const evaluar = async () => {
      try {
        const resultado = await evaluarQuiz(quizIdStr, alumnoIdStr, respuestas, tokenStr);
        setResultado(resultado);
      } catch (error: any) {
        console.error('Error al evaluar el quiz:', error.response?.data || error.message);
      }
    };

    if (quizIdStr && alumnoIdStr && respuestas.length > 0 && tokenStr && resultado === null) {
      evaluar();
    }
  }, [quizIdStr, alumnoIdStr, respuestas, tokenStr, resultado]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.resultado}>{`Obtuviste ${correctas}/${total}. respuestas correctas`}</Text>

      <Button
        mode="contained"
        onPress={() => setMostrarFeedback(!mostrarFeedback)}
        style={{ marginVertical: 20, backgroundColor: '#3b82f6' }}
        labelStyle={{ color: '#fff' }}
      >
        {mostrarFeedback ? 'Ocultar feedback IA' : 'Ver feedback IA'}
      </Button>
      {mostrarFeedback && !resultado && (
        <Text style={{ color: '#facc15', marginTop: 10, textAlign: 'center' }}>
          🧠 Cargando feedback IA...
        </Text>
      )}

      {mostrarFeedback && resultado &&
        resultado.detalle.map((item: ResultadoPregunta, idx: number) => (
          <Card key={`feedback-${idx}`} style={styles.card}>
            <Card.Content>
              <Text style={styles.preguntaTitulo}>{item.texto}</Text>
              <Text style={styles.texto}>
                Tu respuesta:{' '}
                <Text style={item.correcta ? styles.correcta : styles.incorrecta}>
                  {item.respuesta_usuario}
                </Text>
              </Text>
              {!item.correcta && (
                <Text style={styles.texto}>
                  Respuesta correcta:{' '}
                  <Text style={styles.correcta}>{item.respuesta_correcta}</Text>
                </Text>
              )}
              <Text style={styles.explicacion}>Explicación: {item.explicacion}</Text>
              {!item.correcta && item.feedback_ia && (
                <Text style={styles.feedback}>Feedback IA: {item.feedback_ia}</Text>
              )}
            </Card.Content>
          </Card>
        ))}

      {preguntasArr.map((pregunta, idx) => {
        const esCorrecta = respuestasArr[idx]?.esCorrecta;
        const seleccionada = respuestasArr[idx]?.seleccionada;
        return (
          <Card key={pregunta.id || idx} style={styles.card}>
            <Card.Content>
              <Text style={styles.preguntaTitulo}>{`Pregunta ${idx + 1}`}</Text>
              <Text style={styles.preguntaSubtitulo}>{pregunta.texto}</Text>
              <Text style={styles.texto}>
                Tu respuesta:{' '}
                <Text style={esCorrecta ? styles.correcta : styles.incorrecta}>
                  {seleccionada !== undefined && seleccionada !== null ? pregunta.opciones[seleccionada] : '-'}
                </Text>
              </Text>
              {!esCorrecta && (
                <Text style={styles.texto}>
                  Respuesta correcta:{' '}
                  <Text style={styles.correcta}>{pregunta.opciones[pregunta.respuesta_correcta]}</Text>
                </Text>
              )}
            </Card.Content>
          </Card>
        );
      })}





    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: '#0f172a',
    paddingBottom: 32,
  },
  resultado: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#10b981',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  preguntaTitulo: {
    color: '#facc15',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  preguntaSubtitulo: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 6,
  },
  texto: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 4,
  },
  correcta: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  incorrecta: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  explicacion: {
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 6,
  },
  feedback: {
    color: '#facc15',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
