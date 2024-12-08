const { db, admin } = require('../firebaseAdmin');

const addAppointmentSlot = async(req, res) => {
    try {
        const { provider, service, date, startTimes, duration} = req.body;
        console.log("Request body", req.body);
        const timesArray = req.body.startTimes.split(',').map((startTime) => startTime.trim());
        const batch = db.batch();

        timesArray.forEach(startTime => {
            const slotRef = db.collection('appointmentSlots').doc();
            batch.set(slotRef, {
                provider,
                service,
                date,
                startTimes,
                duration,
                status: 'available',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            }); 
        })
        
        await batch.commit();
        res.status(201).json({ message: 'Appointment slot created'});
    } catch(error) {
        console.error('Error creating slots:', error);
        res.status(500).json({ error: 'Failed to create appointment slot'});
    }
};

const retrieveAppointmentSlot = async(req, res) => {
    try {

        const appointmentSlotSnapshot = await db
        .collection('appointmentSlots')
        .get();

        const appointmentSlots = appointmentSlotSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(appointmentSlots);
        console.log("appointmentSlots", appointmentSlots);
    } catch(error) {
        console.error('Error retrieving appointment slot:', error);
        res.status(500).json({ error: 'Failed to retrieve appointment slots'});
    }
};

const retrieveAppointmentSlotById = async(req, res) => {
    try {
      const { id } = req.params
      const appointmentSlotRef = db.collection('appointmentSlots').doc(id);
      const doc = await appointmentSlotRef.get();

      if (doc.exists) {
        console.log("Appointment Slot Data:", doc.data());
        return res.status(200).json(doc.data())
      } else {
        console.log("No such document!");
        return res.status(404).json({ message: "Appointment slot not found" });
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
}

const updateAppointmentSlot = async(req, res) => {
    try {
        const { id } = req.params;
        const { provider, service, date, startTimes, duration } = req.body;

        const updateData = {};
        if (provider) updateData.provider = provider;
        if (service) updateData.service = service;
        if (date) updateData.date = date;
        if (startTimes) updateData.startTimes = startTimes;
        if (duration) updateData.duration = duration;
      
        updateData.updateAt = admin.firestore.FieldValue.serverTimestamp();

        const docRef = admin.firestore().collection('appointmentSlots').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Appointment slot not found' });
        }
        await docRef.update(updateData);
        res.status(200).json({message:'Appointment Slot updated successfully'});
    } catch(error) {
        console.error('Error updating appointment slot:', error);
        res.status(500).json({ error: 'Failed to update appointment slot' });
    }
};

const deleteAppointmentSlot = async(req, res) => {
    try {
        const {id} = req.params;
        const docRef = admin.firestore().collection('appointmentSlots').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({error: 'Appointment slot not found'});
        }
        await docRef.delete();
        res.status(200).json({message: 'Appointment slot deleted successfully'});
    } catch(error) {
        console.error('Error deleting appointment slot:', error);
        res.status(500).json({ error: 'Failed to delete appointment slot'})
    }
};

module.exports = {
    addAppointmentSlot,
    retrieveAppointmentSlot,
    retrieveAppointmentSlotById,
    updateAppointmentSlot,
    deleteAppointmentSlot,
};