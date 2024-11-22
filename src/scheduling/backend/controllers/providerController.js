const { admin } = require('../firebaseAdmin');

const createProvider = async (provider) => {
  try {
    const { name, speciality, phone } = provider;

    await admin.firestore().collection('providers').add({
      name: name,
      speciality: speciality,
      phone: phone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Provider '${name}' created successfully`);
  } catch (error) {
    console.error('Error creating provider:', error);
  }
};

const providers = [
  {
    providerId: 1,
    name: "John Doe",
    speciality: "Massage Therapy",
    phone: "123-456-7890",
  },
  { providerId: 2,
    name: "Jane Smith",
    speciality: "Facial Treatments",
    phone: "987-654-3210",
  },
  {
    providerId: 3,
    name: "Alice Brown",
    speciality: "Aromatherapy",
    phone: "555-123-4567",
  },
  {
    providerId: 4,
    name: "Michael Green",
    speciality: "Reflexology",
    phone: "444-987-6543",
  },
  {
    providerId: 5,
    name: "Emma Wilson",
    speciality: "Hair and Scalp Treatments",
    phone: "333-222-1111",
  },
];

const checkAndCreateProviders = async () => {
  try {
    const existingProviderSnapshot = await admin.firestore().collection('providers').get();
    const existingProviderNames = existingProviderSnapshot.docs.map(doc => doc.data().name);

    const newProviders = providers.filter(
      (provider) => !existingProviderNames.includes(provider.name)
    );

    if (newProviders.length === 0) {
      console.log("All providers already exist. No new providers to add.");
      return;
    }

    console.log(`Adding ${newProviders.length} new providers...`);
      for (const provider of newProviders) {
        await createProvider(provider);
    }
  } catch (error) {
    console.error('Error checking or creating providers:', error);
  }
};

checkAndCreateProviders();

const retrieveProvider = async (req, res) => {
    try {
        const providerSnapshot = await admin.firestore().collection('providers').get();
        const providers = providerSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(providers);
        console.log("providers", providers);
    } catch (error) {
        console.error('Error retrieving providers:', error);
        res.status(500).json({ error: 'Failed to retrieve providers' });
    }
};




module.exports = {
    retrieveProvider,
};