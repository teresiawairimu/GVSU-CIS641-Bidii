const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { admin, db } = require('../firebaseAdmin');

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('Webhook endpoint hit')
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('event constructed:', event.type)

    const eventRef = admin.firestore().collection('processedEvents').doc(event.id);
    const eventDoc = await eventRef.get();
        
    if (eventDoc.exists) {
      return res.status(200).json({ received: true });
    }

    
    if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      console.log("Metadata:", paymentIntent.metadata);
      const { appointmentId, slotId } = paymentIntent.metadata;
      const status = event.type === 'payment_intent.succeeded' ? 'booked' : 'failed';
      const slotStatus = event.type === 'payment_intent.succeeded' ? 'booked' : 'available';

      await admin.firestore().runTransaction(async (transaction) => {
        transaction.update(
          admin.firestore().collection('appointments').doc(appointmentId),
          { status }  
        );

       transaction.set(eventRef, { 
         processedAt: admin.firestore.FieldValue.serverTimestamp(),
         eventType: event.type
        });
      });
    }
    res.status(200).json({ received: true})
  } catch(error) {
    console.error('Error handling webhook event:', error.message);
    res.status(error.message.includes('Webhook signature verification failed') ? 400 : 500)  
       .json({error: error.message});
  }
});

module.exports = router