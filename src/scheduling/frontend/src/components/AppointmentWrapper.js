import AppointmentForm from './AppointmentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe} from '@stripe/stripe-js';
import { useAuth } from '../context/AuthContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const AppointmentWrapper = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;
 

  return (
    <Elements stripe={stripePromise}>
        <AppointmentForm userId={currentUser.uid} />
    </Elements>
  )
}

export default AppointmentWrapper;