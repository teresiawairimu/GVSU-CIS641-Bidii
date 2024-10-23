const admin = require('firebase-admin');

const createClient = async(req, res) => {
  const {name, email, phone, password, address, city, state, zip} = req.body;
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
        role: 'client',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.status(201).json({uid: userRecord.uid, message: 'Client created'})
    } catch(error) {
      console.error('Error creating client:', error);
      res.status(500).json({ error: 'Failed to create client'});
    }
};


module.exports = {
    createClient
}