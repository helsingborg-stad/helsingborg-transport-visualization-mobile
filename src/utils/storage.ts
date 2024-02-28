import AsyncStorage from '@react-native-async-storage/async-storage';

export const readFromAsyncStorage = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('Failed to read ' + key);
    return null;
  }
};

export const writeToAsyncStorage = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log('Failed to save ' + key + ' in LocalStorage');
  }
};
