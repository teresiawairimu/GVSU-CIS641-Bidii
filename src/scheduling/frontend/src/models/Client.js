import User from './User';
/**
 * Class representing a client user.
 * Extends the User class.
 */
class Client extends User {
  /**
   * @param {string} uid - The unique identifier for the client.
   * @param {string} name - The name of the client.
   * @param {string} phone - The phone number of the client.
   * @param {string} email - The email address of the client.
   */
  constructor({ uid, name, phone, email }) {
    super({ uid, name, phone, email, role: "client" });
  }

  /**
   * Books an appointment for the client.
   * @param {string} appointmentId - The ID of the appointment to book.
   * @returns {string} A confirmation message for the booked appointment.
   */
  bookAppointment(appointmentId) {
    return `Client ${this._name} booked appointment with ID: ${appointmentId}`;
  }
}

export default Client;