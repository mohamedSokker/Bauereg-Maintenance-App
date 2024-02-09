import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserData = async () => {
  const userData = await AsyncStorage.getItem("token");
  return userData;
};
