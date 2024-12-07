import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { retrieveAppointmentSlots, deleteAppointmentSlot   } from '../services/appointmentSlotService';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row, Table  } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrashAlt } from 'react-icons/fa';
import AppointmentSlot from '../models/AppointmentSlot';
import NavbarComponent from '../components/NavbarComponent';




const AppointmentSlotPage = () => {
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const { currentUser } = useAuth();
  const navigate  = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

    
    
  const handleDelete = async (appointmentSlotId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this slot?');
    if (!confirmDelete) return;
    try {
        const idToken = await currentUser.getIdToken();
        await deleteAppointmentSlot(currentUser.uid, appointmentSlotId, idToken);
        setAppointmentSlots(appointmentSlots.filter((appointmentSlot) => appointmentSlot.id !== appointmentSlotId));
    } catch (error) {
        console.error(error);
        setError('Failed to delete the appointment. Please try again')
    }
  }

  useEffect(() => {
    const fetchAppointmentSlots = async () => {
      if (!currentUser) return;
        try {
          setIsLoading(true);
          setError(null);
          const idToken = await currentUser.getIdToken();
          if (!idToken) throw new Error('Unauthorized');
          const appointmentSlotData = await retrieveAppointmentSlots(idToken);
          console.log("appointment slot", appointmentSlotData);
          const slots = appointmentSlotData.map(
            (slot) => new AppointmentSlot(
              slot.id,
              slot.provider,
              slot.service,
              slot.date,
              slot.startTimes,
              slot.duration,
              slot.status
            )
          )
          setAppointmentSlots(slots); 
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setAppointmentSlots([]);
          } else {
            setError(error.message || 'Failed to retrieve appointment slots. Please try again later')
          }
        } finally {
          setIsLoading(false);
        }
    }
    fetchAppointmentSlots();
  }, [currentUser]);

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  return (
    <div className="min-h-screen">
      <div className="w-full">
        <NavbarComponent />
      </div> 
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">Appointment Slots</h1>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col className="text-end">
            <Button
              variant="primary"
              onClick={() => navigate('/appointmentSlot/create')}
            >
              <FaPlus /> Add Appointment Slot
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Provider</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Start Times</th> 
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointmentSlots.length === 0 && !isLoading ? (
                  <tr><td colSpan="8" className="text-center">No appointments found.</td></tr>
                ) : (
                  appointmentSlots.map((appointmentSlot, index) => (
                    <tr key={appointmentSlot.id}>
                      <td>{index + 1}</td>
                      <td>{appointmentSlot.getProvider()}</td>
                      <td>{appointmentSlot.getService()}</td>
                      <td>{appointmentSlot.formatDate()}</td>
                      <td>{appointmentSlot.formatStartTimes()}</td>
                      <td>{appointmentSlot.getDuration()}</td>
                      <td>{appointmentSlot.getStatus()}</td>
                      <td>
                        <FaEdit
                          className="mx-2 text-primary"
                          onClick={() => navigate(`/appointmentSlot/${appointmentSlot.id}/edit`)}
                          style={{ cursor: 'pointer'}}
                        /> 
                        <FaTrashAlt
                          className="text-danger"
                          onClick={() => handleDelete(appointmentSlot.id)}
                          style={{cursor: 'pointer'}}
                        />
                      </td>
                    </tr>
                  ))
                )}        
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AppointmentSlotPage;