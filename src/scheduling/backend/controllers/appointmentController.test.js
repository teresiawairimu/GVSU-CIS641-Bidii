const request = require('supertest');
const sinon = require('sinon');
const { app } = require('../app'); 
const { db, admin } = require('../firebaseAdmin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

jest.mock('../firebaseAdmin', () => ({
  db: {
    collection: jest.fn(),
  },
  admin: {
    firestore: jest.fn(() => ({
      collection: jest.fn(),
      FieldValue: {
        serverTimestamp: jest.fn(),
      },
      runTransaction: jest.fn(),
    })),
  },
}));

jest.mock('stripe');

describe('Appointment Controller Tests', () => {
  let server;
  let mockFirestore, mockStripe;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    mockFirestore = {
      collection: jest.fn(() => ({
        add: jest.fn().mockResolvedValue({ id: 'mockAppointmentId' }),
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: jest.fn(() => ({ status: 'available', userId: 'mockUid' })),
          }),
          update: jest.fn(),
          delete: jest.fn(),
        })),
        where: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            docs: [
              { id: 'appointment1', data: () => ({ userId: 'mockUid' }) },
            ],
          }),
        })),
      })),
    };

    admin.firestore.mockReturnValue(mockFirestore);

    mockStripe = {
      paymentIntents: {
        create: jest.fn().mockResolvedValue({
          client_secret: 'mockClientSecret',
        }),
      },
    };

    stripe.mockImplementation(() => mockStripe);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a payment intent and appointment', async () => {
    const req = {
      body: { date: '2024-12-01', time: '10:00', serviceId: 'service1' },
      user: { uid: 'mockUid' },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      send: jest.fn(),
    };

    const { createPaymentClient } = require('../controllers/appointmentController');
    await createPaymentClient(req, res);

    expect(mockFirestore.collection).toHaveBeenCalledWith('appointments');
    expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 3000,
        currency: 'usd',
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      clientSecret: 'mockClientSecret',
      appointmentId: 'mockAppointmentId',
    });
  });

  test('should retrieve appointments for a user', async () => {
    const req = { user: { uid: 'mockUid' } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      send: jest.fn(),
    };

    const { retrieveAppointment } = require('../controllers/appointmentController');
    await retrieveAppointment(req, res);

    expect(mockFirestore.collection).toHaveBeenCalledWith('appointments');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'appointment1',
        }),
      ])
    );
  });

  test('should update an appointment for a user', async () => {
    const req = {
      params: { id: 'appointment1' },
      body: { date: '2024-12-02', time: '11:00' },
      user: { uid: 'mockUid' },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      send: jest.fn(),
    };

    const { updateAppointment } = require('../controllers/appointmentController');
    await updateAppointment(req, res);

    expect(mockFirestore.collection).toHaveBeenCalledWith('appointments');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Appointment updated successfully',
    });
  });

  test('should cancel an appointment for a user', async () => {
    const req = {
      params: { id: 'appointment1' },
      user: { uid: 'mockUid' },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      send: jest.fn(),
    };

    const { cancelAppointment } = require('../controllers/appointmentController');
    await cancelAppointment(req, res);

    expect(mockFirestore.collection).toHaveBeenCalledWith('appointments');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Appointment deleted successfully',
    });
  });
});
