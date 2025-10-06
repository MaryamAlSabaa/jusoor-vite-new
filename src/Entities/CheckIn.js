// src/entities/CheckIn.js
import CheckInData from "./CheckIn.json";

// Make sure this matches what you're importing
export const checkIn = {
  list: async (sortBy = null, limit = null) => {
    let data = [...CheckInData]; // Changed from CheckIn to CheckInData
    if (sortBy) {
      const key = sortBy.replace("-", "");
      const reverse = sortBy.startsWith("-");
      data.sort((a, b) => (a[key] > b[key] ? 1 : -1) * (reverse ? -1 : 1));
    }
    if (limit) data = data.slice(0, limit);
    return new Promise((resolve) => setTimeout(() => resolve(data), 200));
  },

  filter: async (criteria) => {
    const allData = await checkIn.list(); // Changed from CheckIn.list() to checkIn.list()
    return allData.filter(item => {
      return Object.entries(criteria).every(([key, value]) => item[key] === value);
    });
  },

  // ADD THIS METHOD for creating new check-ins
  create: async (checkInData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("CheckIn created:", checkInData);
        resolve({ success: true, id: Date.now(), ...checkInData });
      }, 200);
    });
  }
};