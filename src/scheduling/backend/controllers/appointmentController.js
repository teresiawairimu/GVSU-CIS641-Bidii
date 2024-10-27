const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();
const { db } = require('../firebaseAdmin');

const createPaymentClient = async (req, res) => {
  try {
    const amountInCents = 3000;
    const { uid } = req.user;
    const { date, time } = req.body;
    const appointmentRef = await db.collection('appointments').add({
      uid,
      date,
      time,
      status: 'pending',
    })
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
    res.send({clientSecret: paymentIntent.client_secret, appointmentId})
  } catch (error) {
    res.status(500).send({error: error.message});
  }
}

module.exports = {
  createPaymentClient
}