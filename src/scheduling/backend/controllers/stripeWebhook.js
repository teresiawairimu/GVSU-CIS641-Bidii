const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db } = require('../firebaseAdmin');

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch(error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const appointmentId = paymentIntent.metadata.appointmentId;
        await db.collection('appointments').doc(appointmentId).update({
            status: 'confirmed'
        });
    }
    if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object;
        const appointmentId = paymentIntent.metadata.appointmentId;
        const slotId = paymentIntent.metadata.slotId;

        await db.collection('appointments').doc(appointmentId).update({
            status: 'failed'
        });
        await db.collection('appointmentSlots').doc(slotId).update({
            status: 'available'
        });
    }

    res.status(200).send('Received');
});

module.exports = router