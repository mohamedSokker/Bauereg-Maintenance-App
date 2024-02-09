import { StyleSheet, Text, View, BackHandler } from "react-native";
import React, { useEffect } from "react";

import { colors, parameters } from "../globals/styles";
import Navbar from "../components/Navbar";

const Profile = ({ navigation, route }) => {
  useEffect(() => {
    const appExit = () => {
      navigation.goBack();
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", appExit);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", appExit);
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", (e) => {
      console.log(e.target);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: parameters.statusBarHeight,
    position: "relative",
  },
});
