import healthData from "./HealthData.json";

export const HealthData = {
  list: async (sortBy = null, limit = null) => {
    let data = [...healthData];
    if (sortBy) {
      const key = sortBy.replace("-", "");
      const reverse = sortBy.startsWith("-");
      data.sort((a, b) => (a[key] > b[key] ? 1 : -1) * (reverse ? -1 : 1));
    }
    if (limit) data = data.slice(0, limit);
    return new Promise(resolve => setTimeout(() => resolve(data), 200));
  }
};
