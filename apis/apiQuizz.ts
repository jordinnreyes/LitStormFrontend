import axios from 'axios';

//const API_URL = 'http://192.168.1.42:8002';
const API_URL = 'http://192.168.100.50:8002';

export const crearQuizz = async (quiz: any, token: string) => {
  const response = await axios.post(`${API_URL}/preguntas/`, quiz, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export async function generarPreguntasConIA(tema: string, cantidad: number) {
  const res = await axios.post(`${API_URL}/preguntas/generar-con-ia/`, null, {
    params: {
      tema,
      cantidad,
    },
  });
  return res.data;
}


export const guardarPreguntasSeleccionadas = async (preguntas: any[], token: string) => {
  const response = await axios.post(`${API_URL}/preguntas/guardar-seleccionadas/`, preguntas, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
