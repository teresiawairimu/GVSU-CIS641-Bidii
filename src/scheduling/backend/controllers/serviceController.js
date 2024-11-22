const { admin } = require('../firebaseAdmin');

const getProviderMap = async () => {
  const providerSnapshot = await admin.firestore().collection('providers').get();
  return providerSnapshot.docs.reduce((map, doc) => {
    map[doc.data().name] = doc.id;
    return map;
  }, {});
};


const createService = async (service, providerId) => {
  try {
    const { name, duration, price } = service;

    await admin.firestore().collection('services').add({
      name: name,
      duration: duration,
      price: price,
      provider: providerId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Service '${name} created successfully`);
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};


const checkAndCreateServices = async () => {
  try {
    const providerMap = await getProviderMap();
    const services = [
        { name: "Massage Therapy", duration: 60, price: 100, provider: "John Doe"},
        { name: "Facial Treatment", duration: 45, price: 80, provider: "Jane Smith" },
        { name: "Reflexelogy", duration: 30, price: 50, provider: "Emma Wilson" },
        { name: "Aromatherapy", duration: 75, price: 120, provider: "Alice Brown"},
        { name: "Wellness Consultation", duration: 90, price: 150, provider: "Michael Green"}, 
      ]
    const existingServicesSnapshot = await admin.firestore().collection('services').get();
    const existingServiceNames = existingServicesSnapshot.docs.map(doc => doc.data().name);

    const newServices = services.filter(
      (service) => !existingServiceNames.includes(service.name)
    );

    if (newServices.length === 0) {
      console.log("All services already exist. No new services to add.");
      return;
    }

    console.log(`Adding ${newServices.length} new services...`);
      for (const service of newServices) {
        const providerId = providerMap[service.provider];
        if (!providerId) {
            console.error(`Provider not found: ${service.provider}`);
            continue;
        }
        await createService(service, providerId);
      }  
    
  } catch (error) {
    console.error('Error checking or creating services:', error);
    throw error;
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
    console.log("services", services);
  } catch (error) {
    console.error('Error retrieving services:', error);
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
};

(async () => {
  try {
    await checkAndCreateServices();
  } catch (error) {
    console.error('Error:', error);
  }
})();


module.exports = {
    retrieveService,
};