import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";

import { EXPO_PUBLIC_BASE_URL } from "@env";

import { colors } from "../globals/styles";
import { FooterContext } from "../contexts/FooterContext";
import Navbar from "../components/Navbar";
import { LoginContext } from "../contexts/LoginContext";
import updateData from "../functions/updateData";
import PageLoading from "../components/PageLoading";

const ScanCode = ({ navigation, socket, userID }) => {
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
  const { usersData, token, setReportData, setError, setErrorBody } =
    useContext(LoginContext);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanData, setScanData] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      if (usersData) {
        setIsLoading(true);
        const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appGetReports`;
        const data = await updateData(url, "POST", token, {
          Location: JSON.parse(usersData?.Location),
        });
        setReportData(data);
        navigation.navigate("Reports");
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

  React.useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", (e) => {
      setIsFooter(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      try {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (error) {
        console.log(error.message);
      }
    };

    getBarCodeScannerPermissions();
  }, []);

  useEffect(() => {
    const confirmScan = async (data) => {
      // console.log(data);
      socket.emit("updateAppData", data);
      await getData();
    };
    socket.on("confirmScan", confirmScan);

    return () => {
      socket.off("confirmScan", confirmScan);
    };
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScanData(data);
    socket.emit("scanned", `${userID}==${data}==${usersData?.username}`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isLoading && <PageLoading />}
      <Navbar navigation={navigation} />
      <View style={styles.view4}>
        <View style={styles.view1}>
          <Text style={styles.txt1}>Scan Qr Code</Text>
        </View>
        <View style={styles.view2}>
          {!isClicked ? (
            <TouchableOpacity
              style={styles.btn1}
              onPress={() => setIsClicked(true)}
            >
              <Text style={styles.txt2}>SCAN QR CODE</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.view3}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ height: "90%", width: "100%" }}
              />
              {scanned && <Text>{scanData}</Text>}
              <TouchableOpacity
                style={styles.btn2}
                onPress={() => setIsClicked(false)}
              >
                <Text style={styles.txt3}>STOP</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ScanCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: "relative",
    alignItems: "center",
  },
  view4: { flex: 1, width: "100%", padding: 10, alignItems: "center" },
  view1: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.logo2,
    width: "100%",
    padding: 18,
    borderRadius: 8,
  },
  txt1: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.logo,
  },
  view2: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  btn1: {
    width: "90%",
    backgroundColor: colors.logo,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 100,
  },
  txt2: {
    fontSize: 18,
    color: colors.white,
  },
  view3: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  btn2: {
    width: "90%",
    backgroundColor: colors.logo,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  txt3: {
    color: colors.white,
    fontSize: 16,
  },
});
