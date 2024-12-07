const { db, admin } = require('../firebaseAdmin');


const createUser = async(req, res) => {
  const {name, phone, email, role} = req.body;

  if (!req.user || !req.user.uid) {
    return res.status(400).json({ error: "Invalid request: Missing user UID" });
  };

  const { uid } = req.user;

  try {
    await admin.auth().setCustomUserClaims(uid, { role: role });
    const userData = {
      uid: uid,
      name: name,
      phone: phone,
      email: email,
      role: role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }
    
    await db.collection('users').doc(uid).set(userData);
    res.status(201).json({uid: uid, message: `${role} created`})
    } catch(error) {
      console.error(`Error creating ${role}:`, error);
      res.status(500).json({ error: `Failed to create ${role}`});
    }
};

const retrieveProfileById = async(req, res) => {
  try {
    const { uid } = req.user;
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({error: 'User not found'});
    }
    const userData = userDoc.data();
    res.status(200).json(userData);
  } catch (error){
    res.status(500).json({error: error.message});
  }
}

const retrieveProfile = async(req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
        const users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};


const modifyUser = async (req, res) => {
  try {
      const { uid } = req.user;
      const { name, phone, email} = req.body;
      await admin.firestore().collection('users').doc(uid).update({
          name: name,
          phone: phone,
          email: email,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.status(200).json({ message: 'profile updated successfully' });
  } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
  }
};

const deleteUser = async (req, res) => {
  try {
      const { uid } = req.user;

      await admin.firestore().collection('users').doc(uid).delete();

      res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).json({ error: 'Failed to delete profile' });
  }
};




module.exports = {
  createUser,
  retrieveProfileById,
  retrieveProfile,
  modifyUser,
  deleteUser,
};