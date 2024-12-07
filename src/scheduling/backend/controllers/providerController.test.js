const { retrieveProvider } = require('../path/to/module');
const { admin } = require('../firebaseAdmin');

jest.mock('../firebaseAdmin', () => {
  const firestoreMock = {
    collection: jest.fn(() => firestoreMock),
    add: jest.fn(() => Promise.resolve()),
    get: jest.fn(() => ({
      docs: [
        { id: '1', data: () => ({ name: 'John Doe', speciality: 'Massage Therapy', phone: '123-456-7890' }) },
        { id: '2', data: () => ({ name: 'Jane Smith', speciality: 'Facial Treatments', phone: '987-654-3210' }) },
      ],
    })),
  };

  return {
    admin: {
      firestore: jest.fn(() => firestoreMock),
      firestore: {
        FieldValue: {
          serverTimestamp: jest.fn(() => new Date()),
        },
      },
    },
  };
});

describe('Provider Module', () => {
  describe('createProvider', () => {
    it('should add a provider to Firestore', async () => {
      const provider = {
        name: 'Alice Brown',
        speciality: 'Aromatherapy',
        phone: '555-123-4567',
      };

      const createProvider = require('../path/to/module').createProvider;
      await createProvider(provider);

      expect(admin.firestore().collection).toHaveBeenCalledWith('providers');
      expect(admin.firestore().collection('providers').add).toHaveBeenCalledWith({
        name: provider.name,
        speciality: provider.speciality,
        phone: provider.phone,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('checkAndCreateProviders', () => {
    it('should only add new providers that do not already exist', async () => {
      const checkAndCreateProviders = require('../path/to/module').checkAndCreateProviders;

      await checkAndCreateProviders();

      expect(admin.firestore().collection).toHaveBeenCalledWith('providers');
      expect(admin.firestore().collection('providers').get).toHaveBeenCalled();
      expect(admin.firestore().collection('providers').add).toHaveBeenCalledTimes(3); // Assuming 3 new providers from mock
    });

    it('should not add any providers if all exist', async () => {
      jest.spyOn(admin.firestore().collection('providers'), 'get').mockResolvedValueOnce({
        docs: [
          { id: '1', data: () => ({ name: 'John Doe' }) },
          { id: '2', data: () => ({ name: 'Jane Smith' }) },
          { id: '3', data: () => ({ name: 'Alice Brown' }) },
        ],
      });

      const checkAndCreateProviders = require('../path/to/module').checkAndCreateProviders;
      await checkAndCreateProviders();

      expect(admin.firestore().collection('providers').add).not.toHaveBeenCalled();
    });
  });

  describe('retrieveProvider', () => {
    it('should retrieve providers from Firestore', async () => {
      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await retrieveProvider(req, res);

      expect(admin.firestore().collection).toHaveBeenCalledWith('providers');
      expect(admin.firestore().collection('providers').get).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: '1', name: 'John Doe', speciality: 'Massage Therapy', phone: '123-456-7890' },
        { id: '2', name: 'Jane Smith', speciality: 'Facial Treatments', phone: '987-654-3210' },
      ]);
    });

    it('should handle errors when retrieving providers', async () => {
      jest.spyOn(admin.firestore().collection('providers'), 'get').mockRejectedValueOnce(new Error('Firestore error'));

      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await retrieveProvider(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve providers' });
    });
  });
});
