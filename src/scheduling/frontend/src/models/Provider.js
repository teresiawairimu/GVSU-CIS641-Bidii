/**
 * Class representing a provider
 */
class Provider {
  /**
   * Constructs a Provider object.
   * @param {string} id - The unique identifier for the provider.
   * @param {string} name - The name of the provider.
   * @param {string} speciality- The provider's speciality area.
   * @param {string} phone - The provider's contact phone number.
   */
  constructor({ id, name, speciality, phone }) {
    if (!id || !name || !speciality || !phone) {
      throw new Error("All fields (id, name, speciality, phone) are required.");
    }

    this._id = id; 
    this._name = name; 
    this._speciality = speciality;
    this._phone = phone;
  }

   /**
   * Gets the provider's ID.
   * @returns {string} The provider's ID.
   */
  getId() {
    return this._id;
  }

   /**
   * Gets the provider's name.
   * @returns {string} The provider's name.
   */
   getName() {
    return this._name;
  }

  
  /**
   * Formats the provider's details for display
   * @returns { string} A formatted string with the provider's details
   */
  formatForDisplay() {
    if (!this._name || !this._speciality || !this._phone) {
      throw new Error("Provider details are incomplete.");
    }
    return `${this._name} - Has ${this._speciality} specialities. Contact: ${this._phone}`;
  }
}


export default Provider;
