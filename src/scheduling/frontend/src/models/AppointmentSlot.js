/**
 * class representing appointmentSlot
 */
class AppointmentSlot {
  /**
   * @param {string} id - The unique identifier for the appointment slot.
   * @param {Provider} provider - The provider associated with the slot.
   * @param {Service} service - The service associated with the slot.
   * @param {string} date - The appointment date in YYYY-MM-DD format.
   * @param {string} startTimes - A comma-separated string of start times.
   * @param {string} duration - The duration of the appointment in minutes.
   * @param {string} status - The status of the appointment (e.g., "available", "booked").
   */
  constructor(id, provider, service, date, startTimes, duration, status) {
    if (!id || typeof id !== "string" || id.trim() === "") {
      throw new Error("Appointment ID must be a non-empty string.");
    }
    if (!provider) {
      throw new Error("A valid provider is required.");
    }
    if (!service) {
      throw new Error("A valid service is required.");
    }
    if (!date || isNaN(Date.parse(date))) {
      throw new Error("Date must be a valid ISO date string.");
    }
    if (!startTimes || typeof startTimes !== "string" || startTimes.trim() === "") {
        throw new Error("Start times must be a non-empty string.");
    }
    if (typeof duration !== "string") {
      throw new Error("Duration must be a positive number.");
    }
    if (!status || typeof status !== "string" || status.trim() === "") {
      throw new Error("Status must be a non-empty string.");
    }

    this._id = id;
    this._provider = provider;
    this._service = service;
    this._date = date;
    this._startTimes = startTimes;
    this._duration = duration;
    this._status = status;
  }


  /**
   * Gets the appointment slot's ID.
   * @returns {string} The appointment slot's ID.
   */
  getId() {
    return this._id;
  }

  /**
   * Gets the appointment slot's provider.
   * @returns {Provider} The provider for the slot.
   */
  getProvider() {
    return this._provider;
  }

  /**
   * Gets the appointment slot's service.
   * @returns {Service} The service for the slot.
   */
  getService() {
    return this._service;
  }

  /**
   * Gets the appointment slot's duration.
   * @returns {Duration} The duration for the slot.
   */
  getDuration() {
    return this._duration;
  }

  /**
   * Gets the appointment slot's status.
   * @returns {Status} The status for the slot.
   */
  getStatus() {
    return this._status;
  }

  /**
   * Formats the appointment slot's date for display.
   * @returns {string} A formatted date string.
   */
  formatDate() {
    if (!this._date) return "No appointment date";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(this._date).toLocaleDateString(undefined, options);
  }

  /**
   * Formats the start times for display.
   * @returns {string} The comma-separated start times string.
   */
  formatStartTimes() {
    return this._startTimes || "No start times available";
  }

  /**
   * Displays the appointment slot details in a brief format.
   * @returns {string} The formatted appointment slot details.
   */
  display() {
    const formattedDate = this.formatDate();
    const formattedStartTimes = this.formatStartTimes();
    const providerName = this._provider.name || "Unknown Provider";
    const serviceName = this._service.name || "Unknown Service";

    return `Provider: ${providerName}, Service: ${serviceName}, Date: ${formattedDate}, Time Slots: ${formattedStartTimes}`;
  }


    /*formatDate() {
        if (!this.date) return 'No appointment date';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(this.date).toLocaleDateString(undefined, options);
    }*/
}

export default AppointmentSlot;