const express = require('express');
const router = express.Router();
const {
    addAppointmentSlot,
    retrieveAppointmentSlot,
    retrieveAppointmentSlotById,
    updateAppointmentSlot,
    deleteAppointmentSlot,
} = require('../controllers/appointmentSlotController')

const { verifyFirebaseToken } = require ('../middleware');

router.post('/', verifyFirebaseToken, addAppointmentSlot);
router.get('/', verifyFirebaseToken, retrieveAppointmentSlot);
router.get('/:id', verifyFirebaseToken, retrieveAppointmentSlotById);
router.put('/:id', verifyFirebaseToken, updateAppointmentSlot);
router.delete('/:id', verifyFirebaseToken, deleteAppointmentSlot);

module.exports = router;