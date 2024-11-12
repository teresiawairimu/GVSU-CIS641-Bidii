const express = require('express');
const router = express.Router();
const {
    addAppointmentSlot,
    retrieveAppointmentSlot,
    updateAppointmentSlot,
    deleteAppointmentSlot,
} = require('../controllers/appointmentController')

const { verifyFirebaseToken } = require ('../middleware');

router.post('/create', verifyFirebaseToken, addAppointmentSlot);
router.get('/', retrieveAppointmentSlot)
router.put('/update:id', verifyFirebaseToken, updateAppointmentSlot);
router.delete('/delete:id', verifyFirebaseToken, deleteAppointmentSlot);

module.exports = router;