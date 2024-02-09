import {
  StyleSheet,
  View,
  BackHandler,
  StatusBar,
  Alert,
  Linking,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";

import { colors, parameters } from "../globals/styles";
import { HomeStack } from "../navigations/MainStack";
import { LoginContext } from "../contexts/LoginContext";
import sendMessage from "../functions/sendNotification";

const Home = ({ socket }) => {
  const { usersData, token } = useContext(LoginContext);

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const appExit = () => {
      BackHandler.exitApp();
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", appExit);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", appExit);
    };
  }, []);

  // useEffect(() => {
  //   if (token) {
  //     try {
  //       sendMessage([usersData.Token], "check problem", "Equipment");
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   }
  // }, [token]);

  const [userID, setUserID] = useState(null);

  const updateLink =
    "https://play.google.com/store/apps/details?id=com.mohamed_sokker.MaintenanceApp";

  const handleAlert = () => {
    BackHandler.exitApp();
    Alert.alert(
      "Update Available",
      "You Must Update If you Want to proceed",
      [
        { text: "Cancel", onPress: () => handleAlert() },
        { text: "Update", onPress: () => handleUpdate() },
      ],
      { cancelable: false }
    );
  };

  const handleUpdate = () => {
    BackHandler.exitApp();
    Alert.alert(
      "Update Available",
      "You Must Update If you Want to proceed",
      [
        { text: "Cancel", onPress: () => handleAlert() },
        { text: "Update", onPress: () => handleUpdate() },
      ],
      { cancelable: false }
    );
    Linking.openURL(updateLink);
  };

  const getUserId = (data) => {
    const appVersion = 5;
    if (appVersion !== data.appVersion) {
      console.log(data);
      Alert.alert(
        "Update Available",
        "You Must Update If you Want to proceed",
        [
          { text: "Cancel", onPress: () => handleAlert() },
          { text: "Update", onPress: () => handleUpdate() },
        ],
        { cancelable: false }
      );
      setUpdate((prev) => !prev);
    }
    socket.emit("userName", usersData?.username);
    setUserID(data.id);
  };

  useEffect(() => {
    socket.on("userID", getUserId);
    return () => {
      socket.off("userID", getUserId);
    };
  }, []);

  useEffect(() => {
    if (!socket.connected) socket.connect();
  }, [socket, token]);

  return (
    <View style={styles.container}>
      <HomeStack socket={socket} userID={userID} />
      <StatusBar
        style="light"
        backgroundColor={colors.grey2}
        translucent={true}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: parameters.statusBarHeight,
    position: "relative",
  },
});
