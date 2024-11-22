import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { createAppointmentSlot, updateAppointmentSlot, retrieveAppointmentSlotById } from '../services/appointmentSlotService';
import { getService } from '../services/servicesService';
import { getProviders } from '../services/providerService';
import Service from '../models/Service';
import Provider from '../models/Provider';
import { useParams, useNavigate } from 'react-router-dom';



const AppointmentSlotFormPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    provider: '',
    service:  '',
    date: '',
    startTimes:  '',
    duration: ''
        
  });

  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        if (currentUser) {
          const idToken = await currentUser.getIdToken();
          const providerData = await getProviders(idToken);
          const providers = providerData.map(
            (data) => new Provider({ id: data.id, ...data })
          );
          setProviders(providers);
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
        setError('Failed to load providers. Please try again.');
      }
    };
    fetchProviders();
  }, [currentUser]);

  useEffect(() =>{
    const fetchServices = async () => {
      try { 
        if (currentUser) {
          const idToken = await currentUser.getIdToken();
          const serviceData = await getService(idToken);
          const services = serviceData.map(
            (data) => new Service({ id: data.id, ...data})
          );
          setServices(services);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setError('Failed to load services. Please try again.');
      }
    };
    fetchServices();
  }, [currentUser]);

  useEffect(() => {
    const fetchSlot = async () => {
      try {
        if (currentUser) {
          setLoading(true);
          const idToken = await currentUser.getIdToken();
          console.log("idToken", idToken);
          const slot = await retrieveAppointmentSlotById(id, idToken);
          console.log("appointmentslotbyiddata", slot);
          setFormData({
            ...slot,
            times: slot.times ? slot.times.join(',') : '',
          });
        }
      } catch (error) {
        setError('Failed to fetch appointment slot details.');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    if (isEditMode && currentUser) {
      fetchSlot();
    }
  }, [id, isEditMode, currentUser]);
        

  const handleChange = (e) => {
    const { name, value} = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
  };

  const handleSubmit  = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to perform this action');
      return;
    } 
    setLoading(true);
    setError('');

    try {
      const updatedTimes = formData.startTimes.split(',').map((time) => time.trim());
      const idToken = await currentUser.getIdToken();
      const updatedFormData = {
        ...formData, 
        times: updatedTimes
      }
      if (isEditMode) {
        await updateAppointmentSlot(id, updatedFormData, idToken);
      } else {
        await createAppointmentSlot(updatedFormData, idToken);
      }
      alert('Appointment slot saved successfully');
      navigate('/admin-dashboard');
    } catch (error) {
      setError('Failed to save the appointment slot. Please try again');
      console.error('SUbmit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center nt-4">
        <Col xs={12} sm={10} md={8} lg={6}>
          <h2>{isEditMode ? 'Edit Appointment Slot' : 'Create Appointment Slot'}</h2>
            {error &&  <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formProvider" className="mb-3">
                <Form.Label>Provider</Form.Label>
                <Form.Select
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Provider</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                        {provider.formatForDisplay()}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formService" className="mb-3">
                <Form.Label>Service</Form.Label>
                <Form.Select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.formatForDisplay()}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formDate" className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}                           
                />          
              </Form.Group>

              <Form.Group controlId="formTimes" className="mb-3">
                <Form.Label>Start Times (Comma-separated) HH:mm (24-hour format)</Form.Label>
                <Form.Control
                  type="text"
                  name="startTimes"
                  value={formData.startTimes}
                  onChange={handleChange}
                  placeholder="E.g., 08:00,09:00,10:00"
                  required               
                />                     
              </Form.Group>
              <Form.Group controlId="formDuration" className="mb-3">
                <Form.Label>Duration of the Service (minutes)</Form.Label>
                <Form.Control
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="E.g., 10, 70"
                  required
                />                                    
              </Form.Group>            
              <Button
               variant="primary"
               type="submit"
               disabled={isLoading}             
              >
                {isLoading ? 'Saving...' : isEditMode ? 'Update Slot' : 'Create Slot'}
              </Button>
                        

            </Form>
        </Col>
      </Row>
    </Container>
  )

}

export default AppointmentSlotFormPage;