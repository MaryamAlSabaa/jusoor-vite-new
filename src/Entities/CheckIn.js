// src/entities/CheckIn.js
import checkInData from "./CheckIn.json";

export const CheckIn = {
  list: async (sortBy = null, limit = null) => {
    let data = [...checkInData];
    if (sortBy) {
      const key = sortBy.replace("-", "");
      const reverse = sortBy.startsWith("-");
      data.sort((a, b) => (a[key] > b[key] ? 1 : -1) * (reverse ? -1 : 1));
    }
    if (limit) data = data.slice(0, limit);
    return new Promise((resolve) => setTimeout(() => resolve(data), 200));
  },

  filter: async (criteria) => {
    const allData = await CheckIn.list();
    return allData.filter(item => {
      return Object.entries(criteria).every(([key, value]) => item[key] === value);
    });
  }
};
