class Provider {
  constructor({ id, name, speciality, phone }) {
    this.id = id; 
    this.name = name; 
    this.speciality = speciality;
    this.phone = phone;
  }


  formatForDisplay() {
    return `${this.name} - Has ${this.speciality} specialities. Contact: ${this.phone}`;
  }
}

export default Provider;
