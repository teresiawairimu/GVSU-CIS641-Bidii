const { db, admin } = require('../firebaseAdmin');


const createClient = async(req, res) => {
  const {name, email, phone} = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      displayName: name,
    });

    const uid = userRecord.uid;

    await db.collection('users').doc(uid).set({
      uid: uid,
      name: name,
      email: email,
      phone: phone,
      role: 'client',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
      res.status(201).json({uid: uid, message: 'Client created'})
    } catch(error) {
      console.error('Error creating client:', error);
      res.status(500).json({ error: 'Failed to create client'});
    }
};

const retrieveProfile = async(req, res) => {
  try {
    const clientsSnapshot = await db.collection('users').get();
        const clients = clientsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error retrieving clients:', error);
        res.status(500).json({ error: 'Failed to retrieve clients' });
    }
};


const modifyClient = async (req, res) => {
  try {
      const { id } = req.user.uid;
      const { email, phone } = req.body;
      await admin.firestore().collection('users').doc(id).update({
          email: email,
          phone: phone,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.status(200).json({ message: 'profile updated successfully' });
  } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
  }
};

const deleteClient = async (req, res) => {
  try {
      const { id } = req.user.uid;

      await admin.firestore().collection('users').doc(id).delete();

      res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).json({ error: 'Failed to delete profile' });
  }
};




module.exports = {
  createClient,
  retrieveProfile,
  modifyClient,
  deleteClient,
};