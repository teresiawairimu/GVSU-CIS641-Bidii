import React, {useState, useEffect} from 'react';
//import { useNavigate } from 'react-router-dom';
import { retrieveAppointments, updateAppointment, deleteAppointment } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
//import DashboardNavbar from '../components/navbar/DashboardNavbar';
import { Col, Container, Button, Card, Modal, Row} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getServiceById } from '../services/servicesService';
import NavbarComponent from '../components/NavbarComponent';


const DashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

    const formatDate = (timestamp) => {
        if (!timestamp || !timestamp._seconds) return 'No appointment date';
        const date = new Date(timestamp._seconds * 1000);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const formatTime = (timestamp) => {
        if (!timestamp || !timestamp._seconds) return 'No time available';
        const date = new Date(timestamp._seconds * 1000);
        return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    };
    

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.date ? appointment.date : '');
    setNewTime(appointment.time ? appointment.time : '');
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const idToken = await currentUser.getIdToken(true);
      const appointmentData = {
        date: newDate,
        time: newTime
      };
      await updateAppointment(selectedAppointment.id, appointmentData, idToken);
      setAppointments((prev) =>
      prev.map((app) =>
      app.id === selectedAppointment.id ? {...app, date: newDate, time: newTime} : app));
        setShowModal(false);
    } catch (error) {
      setError('Failed to update appointment. Please try again.');
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      const idToken = await currentUser.getIdToken();
      await deleteAppointment(appointmentId, idToken);
      setAppointments((prev) => prev.filter((app) => app.id !== appointmentId));
    } catch (error) {
      setError('Failed to delete the appointment. Please try again')
    }
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser) return;
      try {
        setIsLoading(true);
        setError(null);
        const idToken = await currentUser.getIdToken(true);
        const appointmentData = await retrieveAppointments(currentUser.uid, idToken);
        console.log('appointmentData', appointmentData);

        const currentDate = new Date();
        const expiredAppointments = appointmentData.filter(
          (appointment) =>
          appointment && appointment.date && new Date(appointment.date) < currentDate
        );
        for (const expired of expiredAppointments) {
          await deleteAppointment(expired.id, idToken);
        }

        const upcomingAppointments = appointmentData.filter((appointment) => appointment.status === 'booked');
                
        const servicesMap = {};
        for (const appointment of upcomingAppointments) {
          if (!servicesMap[appointment.serviceId]) {
            const service = await getServiceById(appointment.serviceId, idToken);
            servicesMap[appointment.serviceId] = service.name;
          }
        }

        const appointmentsWithServices = upcomingAppointments.map(appointment => ({
          ...appointment,
          serviceName: servicesMap[appointment.serviceId],
        }));
        console.log("upcoming", upcomingAppointments);
        setAppointments(appointmentsWithServices); 
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setAppointments([]);
        } else {
          setError(error.message || 'Failed to retrieve appointments. Please try again later')
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchAppointments();
  }, [currentUser]);


  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>

  return (
    <div className="min-h-screen">
      <div className="w-full">
        <NavbarComponent />
      </div>
        
    <Container fluid className="px-3 py-4">
     
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h1 className="fw-bold">Upcoming appointments</h1>
          <Button 
            variant="success" 
            className="d-flex align-items-center" 
            onClick={() => navigate('/appointment/create')}
          >
            <FaPlus className="me-2" />
              Create Appointment
          </Button>
        </Col>
      </Row>
            
      <Row>
        {appointments.length === 0 && !isLoading && <p>No appointments found.</p>}
        {appointments.map((appointment) => (
          <Col xs={12} md={6} lg={4} key={appointment.id} className="mb-4">
            <Card className="shadow border-0">
              <Card.Body>
                <Card.Title className="fw-semibold">{appointment.serviceName}</Card.Title>
                <Card.Text>
                  <span className="text-muted">Date:</span> {appointment.date}
                </Card.Text>
                <Card.Text>
                  <span className="text-muted">Time:</span> {appointment.time}
                </Card.Text>
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="primary" size="sm" onClick={() => handleEdit(appointment)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(appointment.id)}>
                    <FaTrashAlt />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>     

      {selectedAppointment && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label htmlFor="newDate">new Date</label>
              <input
                id="newDate"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="mt-3">
              <label htmlFor="newTime">new Time</label>
              <input
                id="newTime"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="form-control"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
    </div>
    )

};

export default DashboardPage;