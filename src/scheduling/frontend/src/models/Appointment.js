/**
 * Class representing an appointment.
 */
class Appointment {
  /**
   * @param {string|null}  - The unique identifier for the appointment.
   * @param {string} clientId - The client ID associated with the appointment.
   * @param {string} serviceId - The service ID associated with the appointment.
   * @param {string} date - The date of the appointment (YYYY-MM-DD).
   * @param {string} time - The time of the appointment (HH:mm).
   * @param {string} status="booked"] - The status of the appointment (default: "booked").
   * @param {number} bookingFee - The cost of the bookingFee.
   * @param {appointmentSlotId} appointmentSlotId - The appointmentslot ID associated with the appointment
   */
  constructor({
    id = null,
    clientId,
    serviceId,
    date,
    time,
    status = "booked",
    bookingFee,
    appointmentSlotId,
  }) {
    if (!clientId || typeof clientId !== "string" || clientId.trim() === "") {
      throw new Error("Client ID must be a non-empty string.");
    }
    if (!serviceId || typeof serviceId !== "string" || serviceId.trim() === "") {
      throw new Error("Service ID must be a non-empty string.");
    }
    if (!appointmentSlotId || typeof appointmentSlotId !== "string" || appointmentSlotId.trim() === "") {
      throw new Error("Slot ID must be a non-empty string.");
    }
    if (!date || isNaN(Date.parse(date))) {
      throw new Error("Date must be a valid ISO date string.");
    }
    if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
      throw new Error("Time must be in HH:mm 24-hour format.");
    }
    if (typeof bookingFee !== "number" || bookingFee <= 0) {
      throw new Error("Amount must be a non-negative number.");
    }

    this._id = id;
    this._clientId = clientId;
    this._serviceId = serviceId;
    this._date = date;
    this._time = time;
    this._status = status;
    this._bookingFee = bookingFee;
  }

  /**
   * Gets the appointment's ID.
   * @returns {string} The appointment's ID.
   */
  getId() {
    return this._id;
  }

  /**
   * Gets the service's ID.
   * @returns {string} The service's ID.
   */
  getServiceId() {
    return this._serviceId;
  }

  /**
   * Formats the appointment's date for display.
   * @returns {string} A formatted date string.
   */
  formatDate() {
    if (!this._date) return "No appointment date";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(this._date).toLocaleDateString(undefined, options);
  }

  /**
   * Gets the appointment's time.
   * @returns {string} The appointment time.
   */
  getTime() {
    return this._time;
  }


  /**
   * Gets the appointment's status.
   * @returns {string} The appointment status.
   */
  getStatus() {
    return this._status;
  }

  /**
   * Gets the appointment's booking fee.
   * @returns {string} The appointment booking fee.
   */
  getBookingFee() {
    return this._bookingFee;
  }

 
  setStatus(status) {
    if (!status || typeof status !== "string" || status.trim() === "") {
      throw new Error("Status must be a non-empty string.");
    }
    this._status = status;
  }

  updateDetails({ date, time }) {
    if (date) {
      if (isNaN(Date.parse(date))) {
        throw new Error("Date must be a valid ISO date string.");
      }
      this._date = date;
    }
    if (time) {
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
        throw new Error("Time must be in HH:mm 24-hour format.");
      }
      this._time = time;
    }
   
  }

  cancel() {
    this.setStatus("cancelled");
  }

  isFutureAppointment() {
    const appointmentDateTime = new Date(`${this._date}T${this._time}`);
    return appointmentDateTime > new Date();
  }

  formatForDisplay() {
    const formattedDate = new Date(this._date).toLocaleDateString();
    const formattedTime = new Date(`1970-01-01T${this._time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      id: this._id,
      clientId: this._clientId,
      serviceId: this._serviceId,
      date: formattedDate,
      time: formattedTime,
      status: this._status,
      amount: this._amount,
    };
  }
}

export default Appointment;
