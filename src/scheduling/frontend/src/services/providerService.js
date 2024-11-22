import axios from 'axios';
import api_base_url from './apiConfig';

const provider_api_url = `${api_base_url}/api/providers`;

export const getProviders = async (idToken) => {
  const response = await axios.get(`${provider_api_url}`,
    {
      headers: {
       Authorization: `Bearer ${idToken}`,
      },
      withCredentials: true,    
     }
  );
  return response.data;
}