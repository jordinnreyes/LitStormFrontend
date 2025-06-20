import axios from 'axios';

const fetchUserProfile = async (token) => {
  const response = await axios.get('http://18.217.235.159:8000/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
