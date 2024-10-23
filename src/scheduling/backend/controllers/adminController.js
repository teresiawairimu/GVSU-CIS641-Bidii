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
          
module.exports = {
    createAdmin
}