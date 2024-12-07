/**
 * Class representing a service
 */
class Service {

  /**
   * @param {string} id - The unique identifier for the service.
   * @param {string} name - The name of the service.
   * @param {number} duration- The duration of the service in minutes.
   * @param {number} price - The price of the service.
   */
  constructor({ id, name, duration, price }) {
    if (!id || typeof id !== "string" || id.trim() === "") {
      throw new Error("Service ID must be a non-empty string.");
    }
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new Error("Service name must be a non-empty string.");
    }
    if (typeof duration !== "number" || duration <= 0) {
      throw new Error("Duration must be a positive number.");
    }
    if (typeof price !== "number" || price < 0) {
      throw new Error("Price must be a non-negative number.");
    }

    this._id = id;
    this._name = name;
    this._duration = duration;
    this._price = price;
  }

  /**
   * Gets the service's ID.
   * @returns {string} The service's ID.
   */
  getId() {
    return this._id;
  }


  /**
   * Gets the service's name.
   * @returns {string} The service's name.
   */
  getName() {
    return this._name;
  }

  /**
   * Formats the service's details for display.
   * @returns {string} A formatted string with the service's details.
   */
  formatForDisplay() {
    if (!this._name || this._duration <= 0 || this._price < 0) {
      throw new Error("Service details are invalid.");
    }
    return `${this._name} - ${this._duration} mins ($${this._price})`;
  }
};

export default Service;
