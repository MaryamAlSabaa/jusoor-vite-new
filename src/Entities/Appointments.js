export const Appointment = {
  async create(data) {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Failed to create appointment");
    return await response.json();
  }
};
