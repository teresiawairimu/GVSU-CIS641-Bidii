const admin = require('firebase-admin');

const createAdmin = async(req, res) => {
  const { name, email, phone, password, address, city, state, zip } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
      phoneNumber: phone,
    });
          
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      name: name,
      email: email,
      phone: phone,
      address: {
        street: address,
        city: city,
        state: state,
        zip: zip,
      },
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
          
    res.status(201).json({ uid: userRecord.uid, message: 'Admin created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create admin' });
  }
};

const modifyAdmin = async (req, res) => {
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

const deleteAdmin = async (req, res) => {
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
    createAdmin,
    modifyAdmin,
    deleteAdmin,
};