class AppointmentSlot {
    constructor(id, provider, service, date, startTimes, duration, status) {
        this.id = id;
        this.provider = provider;
        this.service = service;
        this.date = date;
        this.startTimes = startTimes;
        this.duration = duration;
        this.status = status;
    }

    formatDate() {
        if (!this.date) return 'No appointment date';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(this.date).toLocaleDateString(undefined, options);
    }
}

export default AppointmentSlot;