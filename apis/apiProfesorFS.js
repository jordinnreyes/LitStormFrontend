import axios from 'axios';

const fetchUserProfile = async (token: string) => {
  const response = await axios.get('http://192.168.1.45:8000/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
