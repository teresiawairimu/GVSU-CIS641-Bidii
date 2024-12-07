import axios from 'axios';
import api_base_url from './apiConfig';

const appointment_api_url = `${api_base_url}/api/appointments`;

export const createAppointment = async(appointmentData, idToken) => {
    const response = await axios.post(appointment_api_url, appointmentData,
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

export const retrieveAppointments = async (UserId, idToken) => {
    const response = await axios.get(`${appointment_api_url}`,
     {
       headers: {
        Authorization: `Bearer ${idToken}`,
       },
       withCredentials: true,    
      }
    );
    return response.data;
  };

export const updateAppointment = async (appointmentId, appointmentData, idToken) => {
    const response = await axios.put(`${appointment_api_url}/${appointmentId}`, appointmentData,
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

export const deleteAppointment = async (appointmentId, idToken) => {
    await axios.delete(`${appointment_api_url}/${appointmentId}`,
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
            withCredentials: true,
        }
    );
}