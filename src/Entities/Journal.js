// Use localStorage for persistence
const STORAGE_KEY = "journalEntries";

function getStoredEntries() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export const Journal = {
  list: async (sortBy = null, limit = null) => {
    let data = getStoredEntries();
    if (sortBy) {
      const key = sortBy.replace("-", "");
      const reverse = sortBy.startsWith("-");
      data.sort((a, b) => (a[key] > b[key] ? 1 : -1) * (reverse ? -1 : 1));
    }
    if (limit) data = data.slice(0, limit);
    return data;
  },
  create: async (entry) => {
    const entries = getStoredEntries();
    const newEntry = { ...entry, id: Date.now() };
    entries.unshift(newEntry);
    saveStoredEntries(entries);
    return newEntry;
  },
  filter: async (criteria) => {
    return getStoredEntries().filter(entry =>
      Object.entries(criteria).every(([k, v]) => entry[k] === v)
    );
  }
};
