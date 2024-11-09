const { db, admin } = require('../firebaseAdmin');

const addAppointmentSlot = async(req, res) => {
    try {
        const { date, time, serviceId } = req.body;
        await db.collection('appointmentSlots').add({
            date,
            time,
            serviceId,
            status: 'available',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(201).json({ message: 'Appointment slot created'});
    } catch(error) {
        res.status(500).json({ error: 'Failed to create appointment slot'});
    }
};

const retrieveAppointmentSlot = async(req, res) => {
    try {
        const appointmentSlotSnapshot = await admin.firestore().collection('appointmentSlots').get();
        const appointmentSlots = appointmentSlotSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(appointmentSlots);
    } catch(error) {
        console.error('Error retrieving appointment slot:', error);
        res.status(500).json({ error: 'Failed to retrieve appointment slots'});
    }
};

const updateAppointmentSlot = async(req, res) => {
    try {
        const { id } = req.params;
        const { date, time, serviceId, status } = req.body;
        await admin.firestore().collection('appointmentSlots').doc(id).update({
            date: date,
            time: time,
            serviceId: serviceId,
            status: status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(200).json({message:'Appointment Slot updated successfully'});
    } catch(error) {
        console.error('Error updating appointment slot:', error);
        res.status(500).json({ error: 'Failed to update appointment slot' });
    }
};

const deleteAppointmentSlot = async(req, res) => {
    try {
        const {id} = req.params;
        await admin.firestore().collection('appointmentSlots').doc(id).delete();
        res.status(200).json({message: 'Appointment slot deleted successfully'});
    } catch(error) {
        console.error('Error deleting appointment slot:', error);
        res.status(500).json({ error: 'Failed to delete appointment slot'})
    }
};

module.exports = {
    addAppointmentSlot,
    retrieveAppointmentSlot,
    updateAppointmentSlot,
    deleteAppointmentSlot,
};