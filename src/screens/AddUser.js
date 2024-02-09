import { StyleSheet, Text, View, BackHandler } from "react-native";
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FaceDetectorComponent from "../components/FaceDetectorCompoenet";

import { colors } from "../globals/styles";

const AddUser = ({ navigation }) => {
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
      <FaceDetectorComponent />
      <Footer navigation={navigation} />
    </View>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: "relative",
    alignItems: "center",
  },
});
