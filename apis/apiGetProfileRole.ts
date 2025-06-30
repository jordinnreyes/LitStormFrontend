import axios from 'axios';

//const API_URL = 'http://localhost:8000';
//const API_URL = 'http://18.217.235.159:8000';

//const API_URL = 'http://192.168.1.42:8000';


const API_URL = 'https://litstorm.duckdns.org/usuarios';

export const fetchUserProfile = async (token: string) => {
  console.log("API_URL:", API_URL);
  const response = await axios.get(`${API_URL}/users/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
