import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Icon } from "react-native-elements";

import { colors } from "../globals/styles";
import { LoginContext } from "../contexts/LoginContext";
import { initialFieldsData } from "../globals/data";

const Footer = ({ navigation }) => {
  const { usersData, setFieldsData } = useContext(LoginContext);
  return (
    <View style={styles.view4}>
      <View style={styles.view5}>
        <TouchableOpacity onPress={() => navigation.navigate("Reports")}>
          <Icon name="home-outline" type="ionicon" size={32} color="orange" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            usersData?.role === "Operator"
              ? navigation.navigate("SelectEquipment")
              : navigation.navigate("ScanCode");
            setFieldsData(initialFieldsData);
          }}
        >
          {usersData?.role === "Operator" ? (
            <Icon
              name="add-circle-outline"
              type="ionicon"
              size={32}
              color="orange"
            />
          ) : (
            <Icon name="scan-outline" type="ionicon" size={32} color="orange" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  view4: {
    height: 54,
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  view5: {
    backgroundColor: colors.logo,
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
