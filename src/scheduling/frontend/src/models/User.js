/**
 * Class representing a generic user.
 */
class User {
  /**
   * @param {string} uid - The unique identifier for the user.
   * @param {string} name - The name of the user.
   * @param {string} phone - The phone number of the user.
   * @param {string} email - The email address of the user.
   * @param {string} role - The role of the user (e.g., "client", "admin").
   */
  constructor({ uid, name, phone, email, role }) {
    if (!uid || typeof uid !== "string" || uid.trim() === "") {
      throw new Error("UID must be a non-empty string.");
    }
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new Error("Name must be a non-empty string.");
    }
    if (!phone || typeof phone !== "string" || phone.trim() === "") {
      throw new Error("Phone must be a non-empty string.");
    }
    if (!email || typeof email !== "string" || email.trim() === "") {
      throw new Error("Email must be a valid string.");
    }
    if (!role || typeof role !== "string" || role.trim() === "") {
      throw new Error("Role must be a non-empty string.");
    }

    this._uid = uid;
    this._name = name;
    this._phone = phone;
    this._email = email;
    this._role = role;
  }

  /**
   * Gets the user's unique identifier.
   * @returns {string} The user's UID.
   */
  getUid() {
    return this._uid;
  }

  /**
   * Gets the user's name.
   * @returns {string} The user's name.
   */
  getName() {
    return this._name;
  }

  /**
   * Gets the user's phone number.
   * @returns {string} The user's phone number.
   */
  getPhone() {
    return this._phone;
  }

  /**
   * Gets the user's email address.
   * @returns {string} The user's email.
   */
  getEmail() {
    return this._email;
  }

  /**
   * Gets the user's role.
   * @returns {string} The user's role.
   */
  getRole() {
    return this._role;
  }
}

export default User;
