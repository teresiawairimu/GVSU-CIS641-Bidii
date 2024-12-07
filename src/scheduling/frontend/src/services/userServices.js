import axios from 'axios';
import api_base_url from './apiConfig';

const user_api_url = `${api_base_url}/api/users`;

export const registerUser = async(userData, idToken) => {
    console.log("Registering user with data:", userData);
    console.log("Id token:", idToken);
    const response = await axios.post(user_api_url, userData,
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
    );
    console.log("response data:", response.data);
    return response.data;
};

export const getUserById = async(idToken) => {
    const response = await axios.post(user_api_url, {},
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
    );
    return response.data;
}
