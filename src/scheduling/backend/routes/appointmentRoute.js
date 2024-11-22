const express = require('express');
const router = express.Router();
const {
    createPaymentClient,
    retrieveAppointment,
    updateAppointment,
    cancelAppointment,
} = require('../controllers/appointmentController')

const { verifyFirebaseToken } = require ('../middleware');

router.post('/', verifyFirebaseToken, createPaymentClient);
router.get('/', verifyFirebaseToken, retrieveAppointment);
router.put('/:id', verifyFirebaseToken, updateAppointment);
router.delete('/:id', verifyFirebaseToken, cancelAppointment);

module.exports = router;