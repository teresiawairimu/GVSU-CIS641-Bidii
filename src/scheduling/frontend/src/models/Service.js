class Service {
  constructor({ id, name, duration, price, createdAt }) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.price = price;
    this.createdAt = createdAt || new Date();
  }

  formatForDisplay() {
    return `${this.name} - ${this.duration} mins ($${this.price})`;
  }
};

export default Service;
