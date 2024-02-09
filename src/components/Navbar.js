import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors, parameters } from "../globals/styles";
import { LoginContext } from "../contexts/LoginContext";

const Navbar = ({ navigation }) => {
  const {
    isSuccess,
    successMessage,
    error,
    errorBody,
    setUsersData,
    setToken,
  } = useContext(LoginContext);
  return (
    <View style={styles.view1}>
      {error && (
        <View style={styles.view4}>
          <View style={[styles.view5, { backgroundColor: "red" }]}>
            <Text style={styles.txt2}>{errorBody}</Text>
          </View>
        </View>
      )}
      {isSuccess && (
        <View style={styles.view4}>
          <View style={[styles.view5, { backgroundColor: "green" }]}>
            <Text style={styles.txt2}>{successMessage}</Text>
          </View>
        </View>
      )}
      <View style={styles.view2}>
        <TouchableOpacity
          onPress={() => {
            try {
              navigation.goBack();
            } catch (error) {
              console.log(error.message);
            }
          }}
        >
          <Icon
            name="arrow-back-outline"
            type="ionicon"
            size={32}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu-outline" type="ionicon" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity
          style={{ position: "relative" }}
          onPress={() => navigation.navigate("Notifications")}
        >
          <Icon
            name="notifications-outline"
            type="ionicon"
            size={32}
            color="white"
          />
          <View style={styles.view6}></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: "relative" }}
          onPress={() => {
            navigation.navigate("AddUser");
          }}
        >
          <Icon
            type="ionicon"
            name="person-add-outline"
            color={`white`}
            size={32}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  view1: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.logo,
    padding: 20,
    gap: 10,
    width: "100%",
    position: "relative",
    zIndex: 100,
  },
  view2: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  view6: {
    position: "absolute",
    top: 0,
    right: 2,
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 100,
  },
  view4: {
    marginTop: parameters.statusBarHeight,
    opacity: 0.9,
    position: "absolute",
    bottom: -5,
    left: 20,
    zIndex: 100,
    width: "100%",
    height: 80,
    padding: 8,
    paddingHorizontal: 12,
  },
  view5: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  txt2: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
});
