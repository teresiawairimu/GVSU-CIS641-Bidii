const { admin } = require('../firebaseAdmin');

const createService = async (req, res) => {
    try {
        const { name, duration, price } = req.body;

        await admin.firestore().collection('services').add({
            name: name,
            duration: duration,
            price: price,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(201).json({message: 'Service created'})
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Failed to create service'});
    }
};

const retrieveService = async (req, res) => {
    try {
        const serviceSnapshot = await admin.firestore().collection('services').get();
        const services = serviceSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(services);
    } catch (error) {
        console.error('Error retrieving services:', error);
        res.status(500).json({ error: 'Failed to retrieve services' });
    }
};

const modifyService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, duration, price } = req.body;
        await admin.firestore().collection('services').doc(id).update({
            name: name,
            duration: duration,
            price: price,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(200).json({ message: 'Service updated successfully' });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Failed to update service' });
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        await admin.firestore().collection('services').doc(id).delete();

        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Failed to delete service' });
    }
};


module.exports = {
    createService,
    retrieveService,
    modifyService,
    deleteService
};