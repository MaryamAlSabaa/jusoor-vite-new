// src/Entities/CheckIn.js
export const checkIn = {
  list: async () => {
    try {
      // Check both storage locations for compatibility
      const currentCheckIn = localStorage.getItem("currentCheckIn");
      const allCheckIns = localStorage.getItem("allCheckIns");
      
      if (currentCheckIn) {
        const parsed = JSON.parse(currentCheckIn);
        return [parsed];
      }
      
      if (allCheckIns) {
        const parsed = JSON.parse(allCheckIns);
        return Array.isArray(parsed) ? parsed : [];
      }
      
      return [];
    } catch (error) {
      console.error("Error loading check-ins:", error);
      return [];
    }
  },

  filter: async (criteria) => {
    try {
      const allData = await checkIn.list();
      const today = new Date().toISOString().split('T')[0];
      
      return allData.filter(item => {
        if (item.check_in_date !== today) return false;
        return Object.entries(criteria).every(([key, value]) => item[key] === value);
      });
    } catch (error) {
      console.error("Error filtering check-ins:", error);
      return [];
    }
  },

  create: async (checkInData) => {
    try {
      const result = {
        id: Date.now(),
        ...checkInData,
        created_at: new Date().toISOString()
      };
      
      console.log("💾 Saving check-in:", result);
      
      // Save to both storage locations for compatibility
      localStorage.setItem("currentCheckIn", JSON.stringify(result));
      
      // Also save to array for historical data
      const allCheckIns = JSON.parse(localStorage.getItem("allCheckIns") || "[]");
      const filtered = allCheckIns.filter(c => c.id !== result.id);
      filtered.push(result);
      localStorage.setItem("allCheckIns", JSON.stringify(filtered));
      
      console.log("✅ Check-in saved successfully");
      return result;
    } catch (error) {
      console.error("❌ Error saving check-in:", error);
      throw error;
    }
  },
};