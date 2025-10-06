import healthData from "./HealthData.json";

// Validate that healthData is an array, if not use empty array as fallback
const validatedHealthData = Array.isArray(healthData) ? healthData : [];

export const HealthData = {
  list: async (sortBy = null, limit = null) => {
    try {
      // Use the validated array to avoid spread errors
      let data = [...validatedHealthData];
      
      if (sortBy) {
        const key = sortBy.replace("-", "");
        const reverse = sortBy.startsWith("-");
        data.sort((a, b) => (a[key] > b[key] ? 1 : -1) * (reverse ? -1 : 1));
      }
      if (limit) data = data.slice(0, limit);
      
      return new Promise(resolve => setTimeout(() => resolve(data), 200));
    } catch (error) {
      console.error("Error in HealthData.list:", error);
      return []; // Return empty array on error
    }
  },

  filter: async (criteria) => {
    try {
      const allData = await HealthData.list();
      return allData.filter(item => {
        return Object.entries(criteria).every(([key, value]) => item[key] === value);
      });
    } catch (error) {
      console.error("Error in HealthData.filter:", error);
      return [];
    }
  },

  create: async (healthDataItem) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem = { 
          id: Date.now(), 
          ...healthDataItem 
        };
        // In a real app, you would save to a database here
        console.log("HealthData created:", newItem);
        resolve(newItem);
      }, 200);
    });
  },

  // Add method to get today's health data
  getToday: async (userEmail) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const allData = await HealthData.list();
      return allData.filter(item => 
        item.date === today && item.created_by === userEmail
      );
    } catch (error) {
      console.error("Error in HealthData.getToday:", error);
      return [];
    }
  }
};