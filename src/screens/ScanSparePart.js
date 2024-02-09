import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  TextInput,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";

import { EXPO_PUBLIC_BASE_URL } from "@env";

import { colors } from "../globals/styles";
import { FooterContext } from "../contexts/FooterContext";
import Navbar from "../components/Navbar";
import { LoginContext } from "../contexts/LoginContext";
import updateData from "../functions/updateData";
import { Icon } from "react-native-elements";
import { formatDate } from "../functions/formatDate";
import PageLoading from "../components/PageLoading";

const ScanSparePart = ({ navigation, socket, userID }) => {
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
    token,
    setReportData,
    setFieldsData,
    reportDetails,
    setReportDetails,
    setError,
    setErrorBody,
  } = useContext(LoginContext);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanData, setScanData] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [isAddClicked, setIsAddClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [isFinish, setIsFinish] = useState(false);

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

  React.useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", (e) => {
      setIsFooter(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  useEffect(() => {
    setReportDetails((prev) => ({
      ...prev,
      Date_Time: formatDate(reportDetails?.Date_Time),
    }));
  }, []);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaintMaintenance/${reportDetails?.ID}`;
      await updateData(url, "PUT", token, reportDetails);
      await getData();
      setIsAddClicked(false);
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

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScanData(data);
    setCode(data);
    // setReportDetails((prev) => ({
    //   ...prev,
    //   Spare_part: data,
    //   Date_Time: formatDate(reportDetails?.Date_Time),
    //   Problem_start_From: formatDate(reportDetails?.Problem_start_From),
    // }));
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
      {isClicked ? (
        <View style={styles.view3}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: "80%", width: "100%" }}
          />
          <TouchableOpacity
            style={styles.btn2}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.txt3}>Try Again</Text>
          </TouchableOpacity>
          {scanned && <Text>{scanData}</Text>}
          <TouchableOpacity
            style={styles.btn2}
            onPress={() => setIsClicked(false)}
          >
            <Text style={styles.txt3}>STOP</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.view4}>
          <View style={styles.view1}>
            <Icon
              name="tools"
              type="material-community"
              size={50}
              color="orange"
            />
          </View>
          <View style={styles.view5}>
            <Text style={styles.txt4}>Description</Text>
            <Text style={styles.txt4}>Code</Text>
          </View>
          {reportDetails?.Spare_part && (
            <View style={styles.view13}>
              <Text style={styles.txt7}>
                {reportDetails.Spare_part.split(" ")[0]}
              </Text>
              <Text style={styles.txt7}>
                {reportDetails.Spare_part.split("(")[1].split(")")[0]}
              </Text>
            </View>
          )}
          {isAddClicked && (
            <View style={styles.view7}>
              <View style={styles.view8}>
                <View style={styles.view9}>
                  <Text style={styles.txt5}>Add Spare Part</Text>
                  <TouchableOpacity onPress={() => setIsAddClicked(false)}>
                    <Text style={styles.txt6}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={!isFinish ? true : false}
                    style={{ opacity: !isFinish ? 0.7 : 1 }}
                  >
                    <Text style={styles.txt6}>Confirm</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.view11}>
                  <View style={styles.view10}>
                    <TextInput
                      placeholder="Type Code"
                      value={code}
                      onChangeText={(e) => setCode(e)}
                    />
                  </View>
                  <View style={styles.view10}>
                    <TextInput
                      placeholder="Quantity"
                      keyboardType="numeric"
                      value={desc}
                      onChangeText={(e) => setDesc(e)}
                    />
                  </View>
                  <View style={styles.view12}>
                    <TouchableOpacity
                      disabled={!code || !desc ? true : false}
                      style={{ opacity: !code || !desc ? 0.7 : 1 }}
                      onPress={() => {
                        setIsFinish(true);
                        setReportDetails((prev) => ({
                          ...prev,
                          Spare_part: `${code} (${desc})`,
                        }));
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: colors.white,
                        }}
                      >
                        Finish
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
          <View style={styles.view2}>
            <View style={styles.view6}>
              <TouchableOpacity
                style={styles.btn1}
                onPress={() => setIsClicked(true)}
                disabled={isAddClicked ? true : false}
              >
                <Icon
                  name="scan-outline"
                  type="ionicon"
                  size={25}
                  color="white"
                />
              </TouchableOpacity>
              <Text style={styles.txt8}>Or</Text>
              <TouchableOpacity onPress={() => setIsAddClicked(true)}>
                <Icon
                  name="add-circle-outline"
                  type="ionicon"
                  size={32}
                  color="orange"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ScanSparePart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: "relative",
    alignItems: "center",
  },
  view4: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    gap: 20,
    position: "relative",
  },
  view1: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
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
    marginTop: 40,
    zIndex: 10,
  },
  view6: {
    flex: 1,
    width: "100%",
    // justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  btn1: {
    width: "100%",
    backgroundColor: colors.logo,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
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
    gap: 10,
  },
  btn2: {
    width: "90%",
    backgroundColor: colors.logo,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
  },
  txt3: {
    color: colors.white,
    fontSize: 16,
  },
  view5: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
    backgroundColor: colors.grey5,
    width: "100%",
    padding: 10,
  },
  view13: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
    backgroundColor: colors.white,
    width: "100%",
    padding: 10,
  },
  txt4: {
    color: colors.logo,
    fontSize: 16,
    fontWeight: "600",
    width: 100,
  },
  txt8: {
    color: colors.logo,
    fontSize: 16,
    fontWeight: "600",
  },
  txt7: { color: "orange", fontSize: 16, fontWeight: "600", width: 100 },
  view7: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  view8: {
    height: "85%",
    width: "90%",
    borderRadius: 10,
    backgroundColor: "white",
    zIndex: 100,
    shadowColor: colors.grey2,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  view9: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.logo,
    width: "100%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  txt5: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  txt6: {
    fontSize: 16,
    color: "white",
  },
  view10: {
    padding: 10,
    backgroundColor: colors.grey6,
    borderColor: colors.grey4,
    borderBottomWidth: 1,
  },
  view11: {
    padding: 10,
    gap: 20,
  },
  view12: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.logo,
    borderRadius: 5,
  },
});
