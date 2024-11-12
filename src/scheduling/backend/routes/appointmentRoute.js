const express = require('express');
const router = express.Router();
const {
    createPaymentClient,
    updateAppointment,
    cancelAppointment,
} = require('../controllers/appointmentController')

const { verifyFirebaseToken } = require ('../middleware');

router.post('/create', verifyFirebaseToken, createPaymentClient);
router.put('/update:id', verifyFirebaseToken, updateAppointment);
router.delete('/cancel:id', verifyFirebaseToken, cancelAppointment);

module.exports = router;