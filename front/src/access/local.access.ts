import AsyncStorage from '@react-native-async-storage/async-storage';

export enum LocalKey {
  JWT = 'jwt',
}

const LocalAccess = () => {
  const _cache: Map<string, string> = new Map();

  const set = async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
      _cache.set(key, value);
    } catch (e) {
      console.error('Error setting:', key);
      console.error(e);
    }
  };

  const get = async (key: string): Promise<string | undefined> => {
    try {
      const cacheValue = _cache.get(key);
      if (cacheValue) {
        return cacheValue;
      }

      const value = await AsyncStorage.getItem(key);
      if (value) {
        _cache.set(key, value);
        return value;
      }
    } catch (e) {
      console.error('Error getting:', key);
      console.error(e);
    }
  };

  const remove = async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
      _cache.delete(key);
    } catch (e) {
      console.error('Error removing:', key);
      console.error(e);
    }
  };

  const clear = async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
      _cache.clear();
    } catch (e) {
      console.error('Error clearing data');
      console.error(e);
    }
  };

  return {
    set,
    get,
    remove,
    clear,
  };
};

export const localStorage = LocalAccess();
