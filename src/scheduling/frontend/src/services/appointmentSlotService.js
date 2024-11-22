import axios from 'axios';
import api_base_url from './apiConfig';

const slot_api_url = `${api_base_url}/api/appointmentSlots`;

export const createAppointmentSlot = async(appointmentSlotData, idToken) => {
    const response = await axios.post(slot_api_url, appointmentSlotData,
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

export const retrieveAppointmentSlots = async (idToken) => {
    const response = await axios.get(`${slot_api_url}`,
     {
       headers: {
        Authorization: `Bearer ${idToken}`,
       },
       withCredentials: true,    
      }
    );
    return response.data;
}

export const retrieveAppointmentSlotById = async (appointmentSlotId, idToken) => {
    const response = await axios.get(`${slot_api_url}/${appointmentSlotId}`,
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
            withCredentials: true,
            
        }
    );
    return response.data;
}

export const updateAppointmentSlot = async (appointmentSlotId, appointmentSlotData, idToken) => {
    const response = await axios.put(`${slot_api_url}/${appointmentSlotId}`, appointmentSlotData,
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

export const deleteAppointmentSlot = async (appointmentSlotId, idToken) => {
    await axios.delete(`${slot_api_url}/${appointmentSlotId}`,
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
            withCredentials: true,
        }
    );
}