import journalData from "./Journal.json";

export const Journal = {
  list: async (sortBy = null, limit = null) => {
    let data = [...journalData];
    if (sortBy) {
      const key = sortBy.replace("-", "");
      const reverse = sortBy.startsWith("-");
      data.sort((a, b) => (a[key] > b[key] ? 1 : -1) * (reverse ? -1 : 1));
    }
    if (limit) data = data.slice(0, limit);
    return data;
  },
};

export const createJournalEntry = async (entry) => {
  journalData.push(entry);
  return entry;
};

export const filterJournalEntries = async (criteria) => {
  return journalData.filter(entry =>
    Object.entries(criteria).every(([k, v]) => entry[k] === v)
  );
};
