import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Buffer } from "buffer";
import QRCode from "react-native-qrcode-svg";

import { EXPO_PUBLIC_BASE_URL } from "@env";

import { colors } from "../globals/styles";
import { FooterContext } from "../contexts/FooterContext";
import Navbar from "../components/Navbar";
import { LoginContext } from "../contexts/LoginContext";
import { formatDate } from "../functions/formatDate";
import updateData from "../functions/updateData";
import PageLoading from "../components/PageLoading";

const getDate = (date) => {
  const dt = new Date(date);
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
  return dt.toISOString();
};

const QrCode = ({ navigation, socket, userID }) => {
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
    setIsSuccess,
    setSuccessMessage,
    setFieldsData,
    fieldsData,
    usersData,
    token,
    reportData,
    setReportData,
    setError,
    setErrorBody,
    reportDetails,
  } = useContext(LoginContext);

  const [realTime, setRealTime] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [isScanned, setIsScanned] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date(reportDetails?.Problem_start_From)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [serverTime, setServerTime] = useState(
    new Date(reportDetails?.Problem_start_From)
  );
  const [dateDiff, setDateDiff] = useState(0);

  React.useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", (e) => {
      setIsFooter(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const getServerDate = async () => {
      const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/getServerDate`;
      const result = await updateData(url, "POST", token, {});
      setServerTime(new Date(result[0]?.Date));
      setDateDiff(new Date(result[0]?.Date) - new Date());
    };
    getServerDate();
  }, []);

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

  getExactTime = (anyDate) => {
    return anyDate.split(".")[0];
  };

  const checkScan = async (data) => {
    try {
      setIsScanned(true);
      setIsLoading(true);
      const Serverurl = `${EXPO_PUBLIC_BASE_URL}/api/v1/getServerDate`;
      const result = await updateData(Serverurl, "POST", token, {});
      const resTime = Math.floor(
        (new Date(result[0]?.Date) - currentTime) / 1000
      );
      let copyData = { ...reportDetails };
      copyData = {
        ...copyData,
        ResponseTime: (resTime / 60).toFixed(2),
        ResponsibleEngineer: data.split("==")[2],
        // ProblemCreatedBy: data.split("==")[2],
      };
      const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaintMaintenance/${reportDetails?.ID}`;
      await updateData(url, "PUT", token, copyData);
      socket.emit("successScan", { data: data, copyData: copyData });
      await getData();
      socket.emit("updateAppData", "");
      delete copyData?.ID;
      setFieldsData(copyData);
      setSuccessMessage(`${data.split("==")[2]} Start new issue`);
      setIsSuccess(true);
      setIsLoading(false);
      navigation.navigate("MaintTime");
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      setError(true);
      setErrorBody(error.message);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsScanned(true);
      setIsLoading(true);
      const Serverurl = `${EXPO_PUBLIC_BASE_URL}/api/v1/getServerDate`;
      const result = await updateData(Serverurl, "POST", token, {});
      const resTime = Math.floor(
        (new Date(result[0]?.Date) - currentTime) / 1000
      );
      let copyData = { ...reportDetails };
      copyData = {
        ...copyData,
        problem_End_To: result[0]?.Date,
        ResponseTime: (resTime / 60).toFixed(2),
        Breakdown_Time: 0,
        Status: "Cancel",
        CheckTime: 0,
      };
      const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaintMaintenance/${reportDetails?.ID}`;
      await updateData(url, "PUT", token, copyData);
      await getData();
      const bodyData = {
        type: "endIssue",
        username: usersData?.username,
        Equipment: usersData?.Equipment,
        Breakdown_Type: copyData?.Breakdown_Type.split(".")[0],
        Problem_start_From: copyData?.Problem_start_From,
        Equipment_Type: usersData?.eqtype,
      };
      const notURL = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaintNotification`;
      await updateData(notURL, "POST", token, bodyData);
      setSuccessMessage(`Successfully cancelled`);
      socket.emit("updateAppData", "");
      setIsSuccess(true);
      setIsLoading(false);
      navigation.navigate("Reports");
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      setError(true);
      setErrorBody(error.message);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    socket.on("checkScan", checkScan);

    return () => {
      socket.off("checkScan", checkScan);
    };
  }, []);

  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      if (!isScanned) {
        setResponseTime(
          Math.floor((new Date() - currentTime + dateDiff) / 1000)
        );
      }

      setRealTime((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, [realTime]);

  const getTime = (anyTime) => {
    let seconds = (anyTime % 60).toString();
    let minutes = Math.floor((anyTime / 60) % 60).toString();
    let hours = Math.floor(anyTime / 3600).toString();
    if (hours.length === 1) hours = `0${hours}`;
    if (minutes.length === 1) minutes = `0${minutes}`;
    if (seconds.length === 1) seconds = `0${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      {isLoading && <PageLoading />}
      <Navbar navigation={navigation} />
      <View style={styles.view1}>
        <Text style={styles.txt1}>Response time</Text>
      </View>
      <View style={styles.view2}>
        <Text style={styles.txt2}>{getTime(responseTime)}</Text>
      </View>
      <View style={styles.view3}>
        <QRCode size={260} value={`${userID}`} />
      </View>
      <View style={styles.view4}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.txt3}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QrCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: "relative",
    alignItems: "center",
  },
  txt1: {
    color: "orange",
    fontSize: 20,
  },
  view1: { flex: 1 / 15, padding: 10 },
  view2: {
    flex: 1 / 15,
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
