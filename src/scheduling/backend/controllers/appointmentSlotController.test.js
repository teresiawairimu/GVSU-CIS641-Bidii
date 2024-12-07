const { 
  addAppointmentSlot, 
  retrieveAppointmentSlot,
  retrieveAppointmentSlotById,
  updateAppointmentSlot,
  deleteAppointmentSlot 
} = require('../controllers/appointmentSlots');

// Mock Firebase Admin
jest.mock('../firebaseAdmin', () => ({
  db: {
    batch: jest.fn(),
    collection: jest.fn(),
  },
  admin: {
    firestore: {
      FieldValue: {
        serverTimestamp: jest.fn(() => 'mocked-timestamp')
      }
    }
  }
}));

describe('Appointment Slots Controller', () => {
  let req;
  let res;
  
  beforeEach(() => {

    jest.clearAllMocks();
      
    
    res = {
      status: jest.fn().mockReturnThis(),
      son: jest.fn()
    };
});

  describe('addAppointmentSlot', () => {
    beforeEach(() => {
          
      req = {
        body: {
          provider: 'Smith',
          service: 'Hair Treatment',
          date: '2024-12-01',
          startTimes: '09:00,10:00,11:00',
          duration: 60
        }
      };
    });

    it('should successfully create appointment slots', async () => {
          
      const mockBatch = {
        set: jest.fn(),
        commit: jest.fn()
      };
      const mockDoc = jest.fn();
          
      const { db } = require('../firebaseAdmin');
      db.batch.mockReturnValue(mockBatch);
      db.collection.mockReturnValue({
        doc: mockDoc
      });
      mockDoc.mockReturnValue('mocked-doc-ref');

      await addAppointmentSlot(req, res);

      expect(db.collection).toHaveBeenCalledWith('appointmentSlots');
      expect(mockBatch.commit).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Appointment slot created' 
      });
    });

    it('should handle errors when creating appointment slots', async () => {
      const { db } = require('../firebaseAdmin');
      db.batch.mockImplementation(() => {
        throw new Error('Database error');
      });

      await addAppointmentSlot(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Failed to create appointment slot' 
      });
    });
  });

  describe('retrieveAppointmentSlot', () => {
    it('should successfully retrieve all appointment slots', async () => {
      const mockDocs = [
        {
          id: '1',
          data: () => ({
            provider: 'Dr. Smith',
            service: 'Checkup'
          })
        }
      ];

      const { db } = require('../firebaseAdmin');
      db.collection.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          docs: mockDocs
        })
      });

      await retrieveAppointmentSlot(req, res);

      expect(db.collection).toHaveBeenCalledWith('appointmentSlots');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: '1',
          provider: 'Dr. Smith',
          service: 'Checkup'
        }
      ]);
    });

    it('should handle errors when retrieving appointment slots', async () => {
      const { db } = require('../firebaseAdmin');
        db.collection.mockReturnValue({
          get: jest.fn().mockRejectedValue(new Error('Database error'))
        });

        await retrieveAppointmentSlot(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
          error: 'Failed to retrieve appointment slots' 
        });
      });
  });

  describe('retrieveAppointmentSlotById', () => {
    it('should retrieve a specific appointment slot', async () => {
      const mockDoc = {
        exists: true,
        data: () => ({
          provider: 'Dr. Smith',
          service: 'Checkup'
        })
      };

      const { db } = require('../firebaseAdmin');
      db.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockDoc)
        })
      });

      req = { params: { id: '1' } };

      await retrieveAppointmentSlotById(req, res);

      expect(db.collection).toHaveBeenCalledWith('appointmentSlot');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        provider: 'Dr. Smith',
        service: 'Checkup'
      });
    });

    it('should return 404 when appointment slot is not found', async () => {
      const mockDoc = {
        exists: false
      };

      const { db } = require('../firebaseAdmin');
      db.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockDoc)
        })
      });

      req = { params: { id: '1' } };

      await retrieveAppointmentSlotById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Appointment slot not found' 
      });
    });
  });

  describe('updateAppointmentSlot', () => {
    beforeEach(() => {
      req = {
        params: { id: '1' },
        body: {
          provider: 'Dr. Jones',
          service: 'Follow-up'
        }
      };
    });

    it('should successfully update an appointment slot', async () => {
      const mockDoc = {
        exists: true
      };

      const { admin } = require('../firebaseAdmin');
      admin.firestore = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          doc: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue(mockDoc),
            update: jest.fn().mockResolvedValue(true)
          })
        })
      });

      await updateAppointmentSlot(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Appointment Slot updated successfully'
      });
    });

    it('should return 404 when trying to update non-existent slot', async () => {
      const mockDoc = {
        exists: false
      };

      const { admin } = require('../firebaseAdmin');
        admin.firestore = jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            doc: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue(mockDoc)
            })
          })
        });

        await updateAppointmentSlot(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          error: 'Appointment slot not found'
        });
    });
  });

  describe('deleteAppointmentSlot', () => {
    beforeEach(() => {
      req = {
        params: { id: '1' }
      };
    });

    it('should successfully delete an appointment slot', async () => {
      const mockDoc = {
        exists: true
      };

      const { admin } = require('../firebaseAdmin');
      admin.firestore = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          doc: jest.fn().mockReturnValue({
            get: jest().mockResolvedValue(mockDoc),
            delete: jest.fn().mockResolvedValue(true)
          })
        })
      });

      await deleteAppointmentSlot(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Appointment slot deleted successfully'
      });
    });

    it('should return 404 when trying to delete non-existent slot', async () => {
      const mockDoc = {
        exists: false
      };

      const { admin } = require('../firebaseAdmin');
        admin.firestore = jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            doc: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue(mockDoc)
          })
        })
      });

      await deleteAppointmentSlot(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Appointment slot not found'
      });
    });
  });
});