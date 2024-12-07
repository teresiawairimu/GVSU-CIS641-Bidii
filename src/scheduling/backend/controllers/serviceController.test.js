const { retrieveService, retrieveServiceById } = require('../path/to/module');
const { admin } = require('../firebaseAdmin');

jest.mock('../firebaseAdmin', () => {
  const firestoreMock = {
    collection: jest.fn(() => firestoreMock),
    add: jest.fn(() => Promise.resolve()),
    get: jest.fn(() => ({
      docs: [
        { id: '1', data: () => ({ name: 'Massage Therapy', duration: 60, price: 100, provider: 'provider1' }) },
        { id: '2', data: () => ({ name: 'Facial Treatment', duration: 45, price: 80, provider: 'provider2' }) },
      ],
    })),
    doc: jest.fn(() => ({
      get: jest.fn(() => ({ exists: true, id: '1', data: () => ({ name: 'Massage Therapy', duration: 60, price: 100, provider: 'provider1' }) })),
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

describe('Service Module', () => {
  describe('getProviderMap', () => {
    it('should return a map of provider names to IDs', async () => {
      const getProviderMap = require('../path/to/module').getProviderMap;
      const providerMap = await getProviderMap();

      expect(providerMap).toEqual({
        'provider1': '1',
        'provider2': '2',
      });
    });
  });

  describe('checkAndCreateServices', () => {
    it('should only add new services that do not already exist', async () => {
      const checkAndCreateServices = require('../path/to/module').checkAndCreateServices;
      await checkAndCreateServices();

      expect(admin.firestore().collection).toHaveBeenCalledWith('services');
      expect(admin.firestore().collection('services').get).toHaveBeenCalled();
      expect(admin.firestore().collection('services').add).toHaveBeenCalledTimes(3); // Assuming 3 new services from mock
    });

    it('should not add any services if all exist', async () => {
      jest.spyOn(admin.firestore().collection('services'), 'get').mockResolvedValueOnce({
        docs: [
          { id: '1', data: () => ({ name: 'Massage Therapy' }) },
          { id: '2', data: () => ({ name: 'Facial Treatment' }) },
        ],
      });

      const checkAndCreateServices = require('../path/to/module').checkAndCreateServices;
      await checkAndCreateServices();

      expect(admin.firestore().collection('services').add).not.toHaveBeenCalled();
    });
  });

  describe('retrieveService', () => {
    it('should retrieve services from Firestore', async () => {
      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await retrieveService(req, res);

      expect(admin.firestore().collection).toHaveBeenCalledWith('services');
      expect(admin.firestore().collection('services').get).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: '1', name: 'Massage Therapy', duration: 60, price: 100, provider: 'provider1' },
        { id: '2', name: 'Facial Treatment', duration: 45, price: 80, provider: 'provider2' },
      ]);
    });

    it('should handle errors when retrieving services', async () => {
      jest.spyOn(admin.firestore().collection('services'), 'get').mockRejectedValueOnce(new Error('Firestore error'));

      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await retrieveService(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve services' });
    });
  });

  describe('retrieveServiceById', () => {
    it('should retrieve a specific service by ID', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await retrieveServiceById(req, res);

      expect(admin.firestore().collection).toHaveBeenCalledWith('services');
      expect(admin.firestore().collection('services').doc).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: '1',
        name: 'Massage Therapy',
        duration: 60,
        price: 100,
        provider: 'provider1',
      });
    });

    it('should return 404 if the service is not found', async () => {
      jest.spyOn(admin.firestore().collection('services').doc('1'), 'get').mockResolvedValueOnce({ exists: false });

      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await retrieveServiceById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No document' });
    });
  });
});
