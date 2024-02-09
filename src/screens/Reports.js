import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  BackHandler,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Icon } from "react-native-elements";

import { EXPO_PUBLIC_BASE_URL } from "@env";

import { colors, parameters } from "../globals/styles";
import { dict } from "../dictionary";
import { LangContext } from "../contexts/LangContext";
import { FooterContext } from "../contexts/FooterContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LoginContext } from "../contexts/LoginContext";
import updateData from "../functions/updateData";
import PageLoading from "../components/PageLoading";

const Reports = ({ navigation, socket }) => {
  const { lang } = useContext(LangContext);
  const { setIsFooter } = useContext(FooterContext);
  const {
    usersData,
    token,
    fieldsData,
    setReportData,
    reportData,
    setReportDetails,
    setError,
    setErrorBody,
  } = useContext(LoginContext);

  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      if (usersData) {
        console.log(`${usersData.username} getData`);
        setIsLoading(true);
        const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appGetReports`;
        const data = await updateData(url, "POST", token, {
          Location: JSON.parse(usersData?.Location),
        });
        setReportData(data);
        setIsLoading(false);
      }
    } catch (error) {
      setError(true);
      setErrorBody(error.message);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setIsLoading(false);
    }
  };

  const getDataWithoutLoad = async () => {
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

  useEffect(() => {
    socket.on("appDataUpdate", getDataWithoutLoad);

    return () => {
      socket.off("appDataUpdate", getDataWithoutLoad);
    };
  }, []);

  useEffect(() => {
    getData();
  }, [usersData]);

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

  React.useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", (e) => {
      setIsFooter(true);
    });

    return unsubscribe;
  }, [navigation]);

  const getDate = (date) => {
    const dt = new Date(date);
    dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
    return dt.toISOString();
  };

  const getDate1 = (date) => {
    const dt = new Date(date);
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
    return dt.toISOString();
  };

  const handleCancel = async (report) => {
    setIsLoading(true);
    let copied = { ...report };
    copied = {
      ...copied,
      problem_End_To: null,
    };
    try {
      const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaintMaintenance/${copied?.ID}`;
      await updateData(url, "PUT", token, copied);
      await getData();
      const bodyData = {
        type: "newIssue",
        username: usersData?.username,
        Equipment: usersData?.Equipment,
        Breakdown_Type: copyData?.Breakdown_Type.split(".")[0],
        Problem_start_From: copyData?.Problem_start_From,
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

  const handleConfirm = async (report) => {
    setIsLoading(true);
    console.log(report);
    try {
      const Serverurl = `${EXPO_PUBLIC_BASE_URL}/api/v1/getServerDate`;
      const result = await updateData(Serverurl, "POST", token, {});
      let copied = { ...report };
      copied = {
        ...copied,
        CheckTime: Math.floor(
          (new Date(result[0]?.Date) - new Date(report?.problem_End_To)) /
            (1000 * 60)
        ),
      };

      const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaintMaintenance/${copied?.ID}`;
      const resMaint = await updateData(url, "PUT", token, copied);
      console.log(resMaint);
      await getData();
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
      <View style={styles.view3}>
        <Text style={styles.txt1}>{usersData?.username}</Text>
        <Text style={styles.txt2}>{usersData?.role}</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.view4}>
          <View style={{ marginBottom: 30 }}>
            <Text style={styles.txt3}>{dict[lang].reports}</Text>
          </View>
          {reportData.map((report) => (
            <TouchableOpacity
              style={[
                styles.view5,
                {
                  opacity:
                    report.ResponseTime === null &&
                    usersData?.role !== "Operator"
                      ? 0.5
                      : 1,
                },
              ]}
              key={report.ID}
              disabled={
                report.ResponseTime === null && usersData?.role !== "Operator"
                  ? true
                  : false
              }
              onPress={() => {
                setReportDetails(report);
                if (
                  usersData?.role === "Operator" &&
                  report.ResponseTime === null
                ) {
                  navigation.navigate("ReportsQrCode");
                } else {
                  navigation.navigate("FinishReport");
                }
                // console.log(new Date(report?.problem_End_To));
                // console.log(new Date(getDate1(new Date())));
              }}
            >
              <Text style={styles.txt4}>Project</Text>
              <Text style={styles.txt5}>{report.Location}</Text>
              <Text style={styles.txt4}>Equipment</Text>
              <Text style={styles.txt5}>{report.Equipment}</Text>
              <Text style={styles.txt5}>
                {new Date(getDate(report.Problem_start_From)).toLocaleString()}
              </Text>
              {usersData?.role !== "Operator" ? (
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  {!report?.problem_End_To ? (
                    <Icon name="time" type="ionicon" size={32} color="red" />
                  ) : report?.Status === "Cancel" ? (
                    <Icon
                      name="x-circle-fill"
                      type="octicon"
                      size={28}
                      color="orange"
                    />
                  ) : !report?.CheckTime ? (
                    <Icon
                      name="alert-circle"
                      type="ionicon"
                      size={32}
                      color="orange"
                    />
                  ) : (
                    <Icon
                      name="checkmark-circle"
                      type="ionicon"
                      size={32}
                      color="green"
                    />
                  )}
                </View>
              ) : (
                report?.problem_End_To &&
                !report?.CheckTime &&
                report?.Status !== "Cancel" && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingVertical: 15,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: "50%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => handleCancel(report)}
                    >
                      <Icon
                        name="x-circle-fill"
                        type="octicon"
                        size={32}
                        color="red"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: "50%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => handleConfirm(report)}
                    >
                      <Icon
                        name="check-circle-fill"
                        type="octicon"
                        size={32}
                        color="green"
                      />
                    </TouchableOpacity>
                  </View>
                )
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: "relative",
  },
  view3: {
    height: 100,
    backgroundColor: colors.logo,
    padding: 18,
    gap: 10,
  },
  txt1: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.white,
  },
  txt2: {
    fontSize: 20,
    fontWeight: "500",
    color: "orange",
  },
  scrollView: {
    width: "100%",
  },
  view4: {
    padding: 16,
    paddingTop: 28,
    gap: 10,
    marginBottom: 50,
  },
  view5: {
    backgroundColor: colors.grey5,
    width: "100%",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 5,
  },
  txt3: {
    fontSize: 20,
    fontWeight: "400",
    color: colors.logo,
  },
  txt4: { fontSize: 20, color: "orange", fontWeight: "600" },
  txt5: { fontSize: 18, color: colors.logo, fontWeight: "600" },
});
