import userData from "./User.json";

export const User = {
  me: async () => {
    // Always return first user for demo purposes
    return userData[0];
  },

  update: async (id, updates) => {
    const index = userData.findIndex(u => u.id === id);
    if (index !== -1) {
      userData[index] = { ...userData[index], ...updates };
      return userData[index];
    }
    return null;
  }
};
