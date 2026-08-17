/**
 * Universal AsyncStorage adapter for Web & React Native environments.
 * Provides standard getItem, setItem, removeItem, clear interface.
 */

export interface AsyncStorageInterface {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

export const AsyncStorage: AsyncStorageInterface = {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      console.warn("[AsyncStorage] getItem error:", err);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      console.warn("[AsyncStorage] setItem error:", err);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.warn("[AsyncStorage] removeItem error:", err);
    }
  },

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.clear();
    } catch (err) {
      console.warn("[AsyncStorage] clear error:", err);
    }
  },
};

export default AsyncStorage;
