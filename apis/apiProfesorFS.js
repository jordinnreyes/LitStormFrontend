import axios from 'axios';

const fetchUserProfile = async (token) => {
  const response = await axios.get('https://litstorm.duckdns.org/usuarios/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
