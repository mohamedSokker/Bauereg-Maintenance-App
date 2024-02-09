import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  ScrollView,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import QRCode from "react-native-qrcode-svg";
import { Icon } from "react-native-elements";

import {
  EXPO_PUBLIC_BC_ABS_PATH,
  EXPO_PUBLIC_BG_ABS_PATH,
  EXPO_PUBLIC_BC_REL_PATH,
  EXPO_PUBLIC_BG_REL_PATH,
  EXPO_PUBLIC_BASE_URL,
} from "@env";

import { colors } from "../globals/styles";
import { FooterContext } from "../contexts/FooterContext";
import Navbar from "../components/Navbar";
import { LoginContext } from "../contexts/LoginContext";
import { formatDate } from "../functions/formatDate";
import updateData from "../functions/updateData";
import PageLoading from "../components/PageLoading";
import addMinutes from "../functions/addMinutes";

const allowedSpPartsRoles = ["Senior", "Junior", "Technician"];
const allowedRoles = ["Senior", "Junior"];

const getDate = (date) => {
  const dt = new Date(date);
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
  return dt.toISOString();
};

const FinishReport = ({ navigation, socket, userID }) => {
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

  const { setIsFooter } = useContext(FooterContext);
  const {
    usersData,
    reportDetails,
    token,
    setReportData,
    setError,
    setErrorBody,
  } = useContext(LoginContext);

  const [realTime, setRealTime] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(
    addMinutes(reportDetails?.Problem_start_From, reportDetails?.ResponseTime)
  );
  const [path, setPath] = useState("");
  const [relPath, setRelPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dateDiff, setDateDiff] = useState(0);

  React.useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", (e) => {
      setIsFooter(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const getServerDate = async () => {
      setIsLoading(true);
      const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/getServerDate`;
      const result = await updateData(url, "POST", token, {});
      setDateDiff(new Date(result[0]?.Date) - new Date());
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };
    getServerDate();
  }, []);

  useEffect(() => {
    if (reportDetails?.Equipment_Type === "Trench_Cutting_Machine") {
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
      //   if (!isScanned)
      if (!reportDetails?.problem_End_To) {
        setResponseTime(
          Math.floor((new Date() - currentTime + dateDiff) / 1000)
        );
      } else {
        if (reportDetails?.Status === "Cancel") {
          setResponseTime(0);
        } else {
          setResponseTime(
            Math.floor(
              (new Date(reportDetails?.problem_End_To) - currentTime) / 1000
            )
          );
        }
      }

      setRealTime((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, [realTime]);

  const getTime = (anyTime) => {
    let seconds = (anyTime % 60).toString();
    let minutes = Math.floor((anyTime / 60) % 60).toString();
    let hours = Math.floor((anyTime / 3600) % 24).toString();
    let days = Math.floor(anyTime / (3600 * 24)).toString();
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const getData = async () => {
    try {
      if (usersData) {
        const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appGetReports`;
        const data = await updateData(url, "POST", token, {
          Location: JSON.parse(usersData?.Location),
        });
        setReportData(data);
      }
    } catch (error) {
      setError(true);
      setErrorBody(error.message);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  const getDate1 = (date) => {
    const dt = new Date(date);
    dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
    return dt.toISOString();
  };

  const handleEnd = async (reportDetail) => {
    setIsLoading(true);
    const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/getServerDate`;
    const result = await updateData(url, "POST", token, {});
    let copied = { ...reportDetails };
    copied = {
      ...copied,
      problem_End_To: result[0]?.Date,
      Breakdown_Time: Math.floor(
        (new Date(result[0]?.Date) - currentTime) / (1000 * 60)
      ),
      Status: `Finish`,
    };
    try {
      const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaintMaintenance/${copied?.ID}`;
      await updateData(url, "PUT", token, copied);
      await getData();
      const usersURL = `${EXPO_PUBLIC_BASE_URL}/api/v1/appGetOperatorToken`;
      const tokenInsites = await updateData(usersURL, "POST", token, {
        username: reportDetails?.ProblemCreatedBy,
      });
      let targetTokens = [];
      tokenInsites.map((t) => {
        if (t?.Token !== "null") {
          targetTokens.push(t?.Token);
        }
        return targetTokens;
      });
      console.log(targetTokens);
      const messageURL = `${EXPO_PUBLIC_BASE_URL}/api/v1/appSendMessage`;
      const messageBody = {
        title: `check if problem resolved`,
        body: `Equipment ${copied?.Equipment} has Problem ${
          copied?.Breakdown_Type?.split(".")[0]
        } at ${new Date(
          getDate1(copied?.Problem_start_From)
        ).toLocaleString()}`,
        Tokens: targetTokens,
      };
      const res = await updateData(messageURL, "POST", token, messageBody);
      console.log(res);
      const bodyData = {
        type: "endIssue",
        username: usersData?.username,
        ProfileImg: usersData?.img,
        Equipment: usersData?.Equipment,
        Breakdown_Type: copied?.Breakdown_Type.split(".")[0],
        Problem_start_From: `${new Date(
          getDate1(copied?.Problem_start_From)
        ).toLocaleString()}`,
        Equipment_Type: usersData?.eqtype,
      };
      const notURL = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaintNotification`;
      await updateData(notURL, "POST", token, bodyData);
      socket.emit("updateAppData", "");
      setIsLoading(false);
    } catch (error) {
      setError(true);
      setErrorBody(error.message);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <PageLoading />}
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
            <Text style={styles.txt5}>{reportDetails?.Equipment}</Text>
            <Text style={styles.txt4}>Location</Text>
            <Text style={styles.txt5}>{reportDetails?.Location}</Text>
          </View>
          <View style={styles.view6}>
            <Text style={styles.txt4}>Breakdown_Type</Text>
            {reportDetails?.Breakdown_Type?.split(",")?.map((d) => (
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
          {allowedSpPartsRoles.includes(usersData?.role) &&
            reportDetails?.Status !== "Cancel" && (
              <View style={styles.view8}>
                <TouchableOpacity
                  style={{ flexDirection: "column", gap: 10 }}
                  onPress={() => navigation.navigate("ScanSparePart")}
                >
                  <Icon
                    name="tools"
                    type="material-community"
                    size={32}
                    color="orange"
                  />
                  <Text style={styles.txt6}>Spare Parts</Text>
                </TouchableOpacity>
                {allowedRoles.includes(usersData?.role) && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 5,
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: "column", gap: 10 }}
                      onPress={() => navigation.navigate("Problem")}
                    >
                      <Icon
                        name="folder-alert"
                        type="material-community"
                        size={32}
                        color="orange"
                      />
                      <Text style={styles.txt6}>Problem</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flexDirection: "column", gap: 10 }}
                      onPress={() => navigation.navigate("Action")}
                    >
                      <Icon
                        name="folder-multiple-plus"
                        type="material-community"
                        size={32}
                        color="orange"
                      />
                      <Text style={styles.txt6}>Action</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flexDirection: "column",
                        gap: 10,
                        opacity:
                          !reportDetails?.Problem ||
                          !reportDetails?.Action ||
                          reportDetails?.CheckTime
                            ? 0.4
                            : 1,
                      }}
                      disabled={
                        !reportDetails?.Problem ||
                        !reportDetails?.Action ||
                        reportDetails?.CheckTime
                          ? true
                          : false
                      }
                      onPress={() => handleEnd(reportDetails)}
                    >
                      <Icon
                        name="check-circle-outline"
                        type="material-community"
                        size={32}
                        color="orange"
                      />
                      <Text style={styles.txt6}>End</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
        </View>
      </ScrollView>
    </View>
  );
};

export default FinishReport;

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
  view8: {
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.logo2,
    padding: 10,
    borderRadius: 10,
    gap: 5,
    flexDirection: "row",
  },
  txt6: { fontSize: 18, fontWeight: "800", color: colors.logo },
  txt4: { fontSize: 20, color: "orange", fontWeight: "600" },
  txt5: { fontSize: 18, color: colors.logo, fontWeight: "600" },
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
