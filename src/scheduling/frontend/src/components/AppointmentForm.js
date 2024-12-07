import React, { useState, useEffect} from "react";
import { useStripe, useElements, CardElement} from "@stripe/react-stripe-js";
import { createAppointment } from "../services/appointmentService";
import { retrieveAppointmentSlots } from "../services/appointmentSlotService";
import { getService } from "../services/servicesService";
import Service from "../models/Service";
import { Button, Form, Alert, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import AppointmentSlot from "../models/AppointmentSlot";
import NavbarComponent from '../components/NavbarComponent';


const AppointmentForm = ({ userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        if (!currentUser) return;
        const idToken = await currentUser.getIdToken();
        if (!idToken) throw new Error('Unauthorized');
        const data = await retrieveAppointmentSlots(idToken);
        const availableSlots = data.filter(slot => slot.status === "available");
        console.log("availableSlots", availableSlots);
        const slotsData = availableSlots.map(
          (slot) => 
            new AppointmentSlot(
              slot.id,
              slot.provider,
              slot.service,
              slot.date,
              slot.startTimes,
              slot.duration,
              slot.status
            )
        )
        console.log("slotsData", slotsData);
        setSlots(slotsData);
      } catch (err) {
        setError("Failed to load appointment slots.");
      }
    };
    fetchSlots();
  }, [currentUser]);

  useEffect(() => {
    if (selectedService) {
      console.log("selectedService:", selectedService);
    console.log("slot service example:", slots[0]?._service);
      const filteredService = slots.filter(slot => slot._service === selectedService);
      console.log("filtered service", filteredService)
      setFilteredSlots(filteredService);
    } else {
      setFilteredSlots([]);
    }
  }, [selectedService, slots]);


  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (!currentUser) return;
        const idToken = await currentUser.getIdToken();
        if (!idToken) throw new Error('Unauthorized');
        const response = await getService(idToken); 
        const servicesData = response.map(
          (service) =>
            new Service({
              id: service.id,
              name: service.name,
              duration: service.duration,
              price: service.price,
            })
        );
        setServices(servicesData);
      } catch (err) {
        setError("Failed to load services.");
      }
    };

    fetchServices();
  }, [currentUser]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded. Please try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Validate input
      if (!services || !date || !time) {
        throw new Error("Please fill in all the required fields.");
      }

      const matchingSlot = filteredSlots.find(slot => 
        slot.formatDate() === date &&
        slot.formatStartTimes().includes(time)
      );


      const idToken = await currentUser.getIdToken();
      const { clientSecret } = await createAppointment({
        serviceId: selectedService,
        date,
        time,
      }, idToken);

   
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        setSuccess(true);
      }
    } catch (error) {
      setError(error.message || "Failed to process the appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="w-full">
        <NavbarComponent />
      </div> 
      <Container className="d-flex justify-content-center align-items-center min-vh-50">
        <Row className="w-100">
          <Col xs={12} sm={10} md={8} lg={6} xl={4} className="mx-auto">
            <h2 className="text-center mt-4 mb-4">Book an Appointment</h2>
      
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Appointment successfully booked!</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label className="mt-4 mb-2">Service</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  className="mt-2"
                >
                 <option value="">Select a service</option>
                 {services.map((s) => (
                    <option key={s.getId()} value={s.getId()}>
                      {s.formatForDisplay()}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label className="mt-4">Available Slots</Form.Label>
                {filteredSlots.length > 0 ? (
                  <ul>
                    {filteredSlots.map((slot) => (
                      <li key={slot.getId()}>
                        {`${slot.formatDate()} | ${slot.formatStartTimes()} | ${slot.getDuration()} min`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No available slots for this service</p>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label className="mt-4">Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="mt-4">Time</Form.Label>
                <Form.Control
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <p className="mt-4"> The fee is $30, which is included in the total cost of the services. This fee is transferrable but non-refundable.</p>
                <Form.Label>Payment</Form.Label>
                <CardElement className="form-control" />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                disabled={isSubmitting || !stripe}
                className="mt-4"
              >
                {isSubmitting ? "Processing..." : "Book Appointment"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AppointmentForm;
