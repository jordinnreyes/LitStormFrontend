import axios from 'axios';

//const API_URL = 'http://localhost:8080';
//const API_URL = 'http://10.100.224.45:8080';

const API_URL = 'http://192.168.100.50:8001';
//const API_URL = 'http://192.168.1.42:8001';


// añadido el 13/06/2025
export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  profesor_id: number;
  codigo_acceso: string;
}
//

export const crearCurso = async (cursoData: { nombre: string; descripcion: string }, token: string) => {
  const response = await axios.post(`${API_URL}/cursos/`, cursoData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const inscribirseCurso = async (codigo: string, token: string) => {
  const response = await axios.post(`${API_URL}/inscripciones/inscribirse/${codigo}`, null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};




export const getCursos = async ():Promise<Curso[]>  => {
  const response = await axios.get<Curso[]>(`${API_URL}/cursos/`);
  return response.data;
};



export interface Inscripcion {
  id: number;
  curso: Curso;
}
export const getMisInscripciones = async (token: string): Promise<Inscripcion[]>  => {
  const response = await axios.get<Inscripcion[]>(`${API_URL}/inscripciones/mis-inscripciones`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};