import axios from 'axios';

//const API_URL = 'http://localhost:8080';
//const API_URL = 'http://10.100.224.45:8080';
const API_URL = 'http://192.168.1.42:8000';

export const fetchUserProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/users/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
