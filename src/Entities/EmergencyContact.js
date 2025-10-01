import emergencyContactsData  from "./EmergencyContact.json";

export const EmergencyContact  = {
  list: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(emergencyContactsData ), 200);
    });
  },
};