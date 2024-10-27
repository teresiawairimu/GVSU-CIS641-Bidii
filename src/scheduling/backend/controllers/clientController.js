const { admin } = require('../firebaseAdmin');


const createClient = async(req, res) => {
  const { uid } = req.user;
  const {name, email, phone, password, address, city, state, zip} = req.body;
  try {
    await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });
    await admin.firestore().collection('users').doc(uid).set({
      uid: uid,
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
      res.status(201).json({uid: uid, message: 'Client created'})
    } catch(error) {
      console.error('Error creating client:', error);
      res.status(500).json({ error: 'Failed to create client'});
    }
};

const sendPaymentLink = async(req, res) => {
  try {
    const paymentLinkUrl = process.env.STRIPE_PAYMENT_LINK;
    res.status(200).json({paymentLinkUrl})
  } catch (error) {
    res.status(500).json({ error: 'Failed to send payment link'})
  }
};

module.exports = {
  createClient,
  sendPaymentLink
}