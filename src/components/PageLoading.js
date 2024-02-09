import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";

import { colors } from "../globals/styles";

const PageLoading = () => {
  return (
    <View style={styles.view6}>
      <View style={styles.view7}>
        <Text>Loading</Text>
        <ActivityIndicator size={20} color={colors.logo} />
      </View>
    </View>
  );
};

export default PageLoading;

const styles = StyleSheet.create({
  view6: {
    position: "absolute",
    zIndex: 200,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  view7: {
    backgroundColor: colors.white,
    shadowColor: colors.grey2,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    paddingHorizontal: 30,
    paddingVertical: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
