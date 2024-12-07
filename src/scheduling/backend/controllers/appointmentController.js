const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();
const { db, admin } = require('../firebaseAdmin');

const createPaymentClient = async (req, res) => {
  try {
    const amountInCents = 3000;
    const { uid } = req.user;
    const { date, time, serviceId } = req.body;
    console.log("req.body", req.body);

    {/*const slotRef = admin.firestore().collection('appointmentSlots').doc(slotId);

    await admin.firestore().runTransaction(async (transaction) => {
      const slotDoc = await transaction.get(slotRef);
      if (!slotDoc.exists || slotDoc.data().status !== 'available') {
        throw new Error('Slot is no longer available');
      }
    });*/}

    const appointmentRef = await admin.firestore().collection('appointments').add({
      userId: uid,
      date,
      time,
      serviceId,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const appointmentId = appointmentRef.id;

    
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        userId: uid,
        appointmentId,
        date,
        time,
      },
    });
    res.status(200).json({clientSecret: paymentIntent.client_secret, appointmentId})
  } catch (error) {
    res.status(500).send({error: error.message});
  }
};

const retrieveAppointment = async(req, res) => {
  try {
    const AppointmentSnapshot = await admin.firestore()
    .collection('appointments')
    .where('userId', '==', req.user.uid)
    .get();
    const appointments = AppointmentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
};

const updateAppointment = async(req, res) => {
  try {
      const { id } = req.params;
      const {date, time} = req.body;
      const appointmentRef = admin.firestore()
      .collection('appointments')
      .doc(id);

      const doc = await appointmentRef.get();
     

      if (!doc.exists) {
        return res.status(404).json({error: 'Appointment not found'})
      }
      if (doc.data().userId !== req.user.uid) {
        return res.status(403).json({error: 'Not authorized'})
      }
      await appointmentRef.update({
          date,
          time,
      });
      res.status(200).json({message: 'Appointment updated successfully'});
  } catch(error) {
    console.error('Failed to update appointment:', error);
    res.status(500).json({error: 'Failed to update appointment'});
  }
};

const cancelAppointment = async(req,res) => {
  try {
    const {id} = req.params;
    const appointmentRef = await admin.firestore()
    .collection('appointments')
    .doc(id)
    .get();

    if (!appointmentRef.exists) {
      return res.status(404).json({error: 'Appointment not found'});
    }
    if (appointmentRef.data().userId !== req.user.uid) {
      return res.status(403).json({ error: 'Not Authorized'});
    }

    await admin. firestore()
    .collection('appointments')
    .doc(id)
    .delete();
    res.status(200).json({message: 'Appointment deleted successfully'});
  } catch(error) {
    console.error('Failed to delete an appointment:', error);
    res.status(500).json({error: 'Failed to delete an appointment'});
  }
}

module.exports = {
  createPaymentClient,
  retrieveAppointment,
  updateAppointment,
  cancelAppointment,
};