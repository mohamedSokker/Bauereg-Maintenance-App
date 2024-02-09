import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext } from "react";

import { colors } from "../globals/styles";
import { getUserData } from "../functions/getUserData";
import { getTokenData } from "../functions/getTokenData";
import { LoginContext } from "../contexts/LoginContext";

const Splash = ({ socket, navigation }) => {
  const { setToken, setUsersData, token, setIsLoading } =
    useContext(LoginContext);

  useEffect(() => {
    const getData = async () => {
      try {
        const userInfo = await getUserData();
        if (!userInfo) {
          navigation?.navigate("Login");
          socket?.disconnect();
          setIsLoading(false);
          return;
        }
        setToken(userInfo);
        if (token) {
          const userData = await getTokenData(token);
          setUsersData(userData);
          navigation?.navigate("Home");
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        navigation?.navigate("Login");
        setIsLoading(false);
      }
    };

    getData();
  }, [token]);
  return (
    <View style={styles.container}>
      <Text>Splash</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.logo,
  },
});
