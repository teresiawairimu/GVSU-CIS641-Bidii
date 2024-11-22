import React, {useState, useEffect} from 'react';
//import { useNavigate } from 'react-router-dom';
import { retrieveAppointments, updateAppointment, deleteAppointment } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
//import DashboardNavbar from '../components/navbar/DashboardNavbar';
import { Button, ListGroup, Modal} from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';


const DashboardPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const { currentUser } = useAuth();

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
            const idToken = await currentUser.getIdToken();
            await updateAppointment(selectedAppointment.id, newDate, newTime, idToken);
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
                const idToken = await currentUser.getIdToken();
                const appointmentData = await retrieveAppointments(currentUser.uid, idToken);
                const upcomingAppointments = appointmentData.filter((appointment) => appointment.status === 'booked');
                setAppointments(upcomingAppointments); 
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
    if (error) return <p>{error}</p>

    return (
        <div> 
            <h1>Upcoming appointments</h1>
            <ListGroup>
            {appointments.length === 0 && !isLoading && <p>No appointments found.</p>}
                {appointments.map((appointment) => (
                    <ListGroup.Item key={appointment.id}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <span>{appointment.service}</span>
                                <br />
                                <span>{formatDate(appointment.date)}</span>
                                <br />
                                <span>{formatTime(appointment.time)}</span>
                            </div>
                            <div>
                                <FaEdit
                                    className="mx-2 text-primary"
                                    onClick={() => handleEdit(appointment)}
                                />
                                <FaTrashAlt
                                    className="text-danger"
                                    onClick={() => handleDelete(appointment.id)}
                                />
                            </div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

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
                        <div>
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
        </div>
    )

};

export default DashboardPage;