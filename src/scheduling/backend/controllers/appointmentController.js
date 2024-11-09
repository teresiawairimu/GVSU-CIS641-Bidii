const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();
const { db } = require('../firebaseAdmin');

const createPaymentClient = async (req, res) => {
  try {
    const amountInCents = 3000;
    const { uid } = req.user;
    const { date, time, slotId } = req.body;

    const slotRef = db.collection('appointmentSlots').doc(slotId);

    await db.runTransaction(async (transaction) => {
      const slotDoc = await transaction.get(slotRef);
      if (!slotDoc.exists || slotDoc.data.status !== 'available') {
        throw new Error('Slot is no longer available');
      }
    });

    const appointmentRef = await db.collection('appointments').add({
      uid,
      date,
      time,
      status: 'pending',
    });

    const appointmentId = appointmentRef.id;

    const clientRef = db.collection('clients').doc(uid);
    await clientRef.update({
      appointments: db.FieldValue.arrayUnion(appointmentId),
    });
    
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
    res.send({clientSecret: paymentIntent.client_secret, appointmentId})
  } catch (error) {
    res.status(500).send({error: error.message});
  }
};

const updateAppointment = async(res, req) => {
  try {
      const { id } = req.params;
      const {date, time} = req.body;
      await db.collection('appointments').doc(id).update({
          date: date,
          time: time,
      });
      res.status(200).json({message: 'Appointment updated successfully'});
  } catch(error) {
    console.error('Failed to update appointment,' error);
    res.status(500).json({})
  }
}

module.exports = {
  createPaymentClient
}