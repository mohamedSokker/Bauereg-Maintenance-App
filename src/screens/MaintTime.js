import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  ScrollView,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";

import {
  EXPO_PUBLIC_BC_ABS_PATH,
  EXPO_PUBLIC_BG_ABS_PATH,
  EXPO_PUBLIC_BC_REL_PATH,
  EXPO_PUBLIC_BG_REL_PATH,
  EXPO_PUBLIC_BASE_URL,
} from "@env";

import { colors } from "../globals/styles";
import Navbar from "../components/Navbar";
import { LoginContext } from "../contexts/LoginContext";
import updateData from "../functions/updateData";

const MaintTime = ({ navigation, socket, userID }) => {
  useEffect(() => {
    const appExit = () => {
      navigation.navigate("Reports");
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", appExit);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", appExit);
    };
  }, []);

  const { fieldsData, usersData, token } = useContext(LoginContext);

  const [realTime, setRealTime] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [path, setPath] = useState("");
  const [relPath, setRelPath] = useState("");

  useEffect(() => {
    if (usersData.eqtype === "Trench_Cutting_Machine") {
      setPath(EXPO_PUBLIC_BC_ABS_PATH);
      setRelPath(EXPO_PUBLIC_BC_REL_PATH);
    } else {
      setPath(EXPO_PUBLIC_BG_ABS_PATH);
      setRelPath(EXPO_PUBLIC_BG_REL_PATH);
    }
  }, []);

  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      setResponseTime(Math.floor((new Date() - currentTime) / 1000));

      setRealTime((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, [realTime]);

  const getTime = (anyTime) => {
    let seconds = (anyTime % 60).toString();
    let minutes = Math.floor((anyTime / 60) % 60).toString();
    let hours = Math.floor((anyTime / 3600) % 60).toString();
    let days = Math.floor((anyTime / (3600 * 24)) % 60).toString();
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <View style={styles.view5}>
        <View style={styles.view2}>
          <Text style={styles.txt2}>{getTime(responseTime)}</Text>
        </View>
      </View>
      <ScrollView style={{ width: "100%", padding: 25 }}>
        <View style={styles.view7}>
          <View style={styles.view6}>
            <Text style={styles.txt4}>Equipment</Text>
            <Text style={styles.txt5}>{fieldsData.Equipment}</Text>
            <Text style={styles.txt4}>Location</Text>
            <Text style={styles.txt5}>{fieldsData.Location}</Text>
          </View>
          <View style={styles.view6}>
            <Text style={styles.txt4}>Breakdown_Type</Text>
            {fieldsData?.Breakdown_Type?.split(",")?.map((d) => (
              <View
                key={d}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Image
                  source={{ uri: `${EXPO_PUBLIC_BASE_URL}/${relPath}/${d}` }}
                  style={{ width: 100, height: 100 }}
                />
                <Text style={styles.txt5}>{d.split(".")[0]}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MaintTime;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: "relative",
    alignItems: "center",
  },
  view5: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  view7: { width: "100%", gap: 30, paddingBottom: 30 },
  view6: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.logo2,
    padding: 10,
    borderRadius: 10,
    gap: 5,
  },
  txt4: { fontSize: 20, color: "orange", fontWeight: "600" },
  txt5: { fontSize: 16, color: colors.logo },
  txt1: {
    color: "orange",
    fontSize: 20,
  },
  view1: { flex: 1 / 15, padding: 10 },
  view2: {
    // flex: 1 / 15,
    padding: 18,
    backgroundColor: colors.logo2,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  view3: {
    flex: 8 / 15,
    justifyContent: "center",
    alignItems: "center",
  },
  view4: { flex: 5 / 15 },
  txt2: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.logo,
  },
  txt3: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.logo,
  },
});
