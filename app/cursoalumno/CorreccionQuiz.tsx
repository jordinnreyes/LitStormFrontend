import { evaluarQuiz } from '@/apis/apiQuizz'; // Asegúrate de tener esta función implementada
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

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
  const theme = useTheme();

  const params = useLocalSearchParams();

const preguntasArr: Pregunta[] = params.preguntas ? JSON.parse(params.preguntas as string) : [];
const respuestasArr: RespuestaUsuario[] = params.respuestasUsuario ? JSON.parse(params.respuestasUsuario as string) : [];

const quizIdStr = typeof params.quizId === 'string' ? params.quizId : '';
const alumnoIdStr = typeof params.alumnoId === 'string' ? params.alumnoId : '';
const tokenStr = typeof params.token === 'string' ? params.token : '';

  /*
  const { quizId, alumnoId, token } = useLocalSearchParams();

  const { preguntas, respuestasUsuario } = useLocalSearchParams();
  const preguntasArr: Pregunta[] = preguntas ? JSON.parse(preguntas as string) : [];
  const respuestasArr: RespuestaUsuario[] = respuestasUsuario ? JSON.parse(respuestasUsuario as string) : [];
  const correctas = respuestasArr.filter(r => r.esCorrecta).length;
  const total = preguntasArr.length;


  const quizIdStr = typeof quizId === 'string' ? quizId : '';
const alumnoIdStr = typeof alumnoId === 'string' ? alumnoId : '';
const tokenStr = typeof token === 'string' ? token : '';
*/

/*
  const correctas = respuestasArr.filter(r => r.esCorrecta).length;
  const total = preguntasArr.length;
  */
console.log("📦 Params recibidos:", params);

const correctas = params.puntuacion ? parseInt(params.puntuacion as string) : respuestasArr.filter(r => r.esCorrecta).length;
const total = params.total ? parseInt(params.total as string) : preguntasArr.length;


const respuestas = preguntasArr.map((pregunta, index) => ({
  pregunta_id: pregunta.id,
  respuesta: parseInt(String(respuestasArr[index]?.seleccionada ?? "-1"), 10)

}));


respuestas.forEach(r => {
  console.log(`✅ ID: ${r.pregunta_id}, Respuesta: ${r.respuesta}, Tipoov: ${typeof r.respuesta}`);
});










const [resultado, setResultado] = useState<{
  detalle: ResultadoPregunta[];
  puntuacion: number;
  total: number;
  
  // puedes añadir más campos si los usas
} | null>(null);
console.log("🧾 Detalle del resultado:", resultado?.detalle);

console.log('📄 Resultado en render:', resultado);


useEffect(() => {
  const evaluar = async () => {
    try {

      console.log('📤 Enviando a evaluarQuiz:', {
        quizIdStr,
        alumnoIdStr,
        respuestas,
        tokenStr,
      });
      const resultado = await evaluarQuiz(quizIdStr, alumnoIdStr, respuestas, tokenStr);

       console.log('✅ Resultado recibido de evaluarQuiz:', resultado);
      setResultado(resultado);
    } catch (error: any) {
      console.error('Error al evaluar el quiz:', error.response?.data || error.message);
    }
  };

  if (
    quizIdStr &&
    alumnoIdStr &&
    respuestas.length > 0 &&
    tokenStr &&
    resultado === null // Solo si no hemos evaluado aún
  ) {
    console.log('✅ Condición del useEffect cumplida, ejecutando evaluar()');
    evaluar();
  }
}, [quizIdStr, alumnoIdStr, respuestas, tokenStr,resultado]);


  return (
    <>
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.resultado, { color: theme.colors.primary }]}>{`Obtuviste ${correctas}/${total}. ¡Buen trabajo!`}</Text>
      {preguntasArr.map((pregunta, idx) => {
        const esCorrecta = respuestasArr[idx]?.esCorrecta;
        const seleccionada = respuestasArr[idx]?.seleccionada;
        return (
          <Card key={pregunta.id || idx} style={[styles.preguntaContainer, { backgroundColor: theme.colors.elevation.level1 }]}> 
            <Card.Content>
              <Text style={[styles.preguntaTitulo, { color: theme.colors.onSurface }]}>{pregunta.texto}</Text>
              <Text>
                Tu respuesta: <Text style={{ color: esCorrecta ? theme.colors.primary || '#388e3c' : theme.colors.error }}>
                  {seleccionada !== undefined && seleccionada !== null
                    ? pregunta.opciones[seleccionada]
                    : '-'}
                </Text>
              </Text>
              {!esCorrecta && (
                <Text>
                  Respuesta correcta: <Text style={{ color: theme.colors.primary }}>
                    {pregunta.opciones[pregunta.respuesta_correcta]}
                  </Text>
                </Text>
              )}
            </Card.Content>
          </Card>
        );
      })}






{resultado && resultado.detalle.map((item: ResultadoPregunta, idx: number) => (
  <Card key={idx} style={{ marginBottom: 12 }}>
    <Card.Content>
      <Text style={{ fontWeight: 'bold' }}>{item.texto}</Text>

      <Text style={{ marginTop: 4 }}>
        Tu respuesta:{" "}
        <Text style={{ color: item.correcta ? theme.colors.primary : theme.colors.error }}>
          {item.respuesta_usuario}
        </Text>
      </Text>

      {!item.correcta && (
        <Text style={{ marginTop: 2 }}>
          Respuesta correcta:{" "}
          <Text style={{ color: theme.colors.primary }}>
            {item.respuesta_correcta}
          </Text>
        </Text>
      )}

      <Text style={{ marginTop: 6, fontStyle: 'italic' }}>
        Explicación: {item.explicacion}
      </Text>

      {!item.correcta && item.feedback_ia && (
        <Text style={{ marginTop: 6, color: 'orange' }}>
          Feedback IA: {item.feedback_ia}
        </Text>
      )}
    </Card.Content>
  </Card>
))}

    </ScrollView>




    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  resultado: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center', textAlign: 'center' },
  preguntaContainer: { marginBottom: 18, borderRadius: 10, elevation: 2 },
  preguntaTitulo: { fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
});
