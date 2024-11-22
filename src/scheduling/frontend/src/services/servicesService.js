import axios from 'axios';
import api_base_url from './apiConfig';

const service_api_url = `${api_base_url}/api/services`;

export const getService = async (idToken) => {
  const response = await axios.get(`${service_api_url}`,
    {
      headers: {
       Authorization: `Bearer ${idToken}`,
      },
      withCredentials: true,    
     }
  );
  return response.data;
}