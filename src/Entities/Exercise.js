import exerciseData from "./Exercise.json";

export const Exercise = {
  list: async () => {
    return new Promise((resolve) => setTimeout(() => resolve(exerciseData), 200));
  }
};
