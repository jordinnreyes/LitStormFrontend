import axios from 'axios';

const fetchUserProfile = async (token: string) => {
  const response = await axios.get('http://<TU_BACKEND>/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
