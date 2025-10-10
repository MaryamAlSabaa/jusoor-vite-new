export const Appointment = {
  async create(data) {
    // getting existing appointments from localStorage
    const existing = JSON.parse(localStorage.getItem("appointments") || "[]");
    const newAppointment = { id: Date.now(), ...data };

    // saving it back to localStorage
    localStorage.setItem("appointments", JSON.stringify([...existing, newAppointment]));
    return newAppointment;
  },

  async getAll() {
    return JSON.parse(localStorage.getItem("appointments") || "[]");
  }
};
