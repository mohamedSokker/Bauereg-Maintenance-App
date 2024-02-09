import { StyleSheet, Text, View, BackHandler } from "react-native";
import React, { useEffect } from "react";

import { colors, parameters } from "../globals/styles";
import Navbar from "../components/Navbar";

const ManPower = ({ navigation }) => {
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
  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
    </View>
  );
};

export default ManPower;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: parameters.statusBarHeight,
    position: "relative",
  },
});
