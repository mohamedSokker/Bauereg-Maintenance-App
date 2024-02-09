import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  TextInput,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { EXPO_PUBLIC_BASE_URL } from "@env";

import { colors } from "../globals/styles";
import { FooterContext } from "../contexts/FooterContext";
import Navbar from "../components/Navbar";
import { LoginContext } from "../contexts/LoginContext";
import updateData from "../functions/updateData";
import { Icon } from "react-native-elements";
import { formatDate } from "../functions/formatDate";
import PageLoading from "../components/PageLoading";

const Action = ({ navigation, socket, userID }) => {
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
    reportDetails,
    setReportDetails,
    setError,
    setErrorBody,
  } = useContext(LoginContext);

  const [isAddClicked, setIsAddClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState("");

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
    setReportDetails((prev) => ({
      ...prev,
      Date_Time: formatDate(reportDetails?.Date_Time),
    }));
  }, []);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      let copied = { ...reportDetails };
      copied = { ...copied, Action: action };
      setReportDetails((prev) => ({
        ...prev,
        Action: action,
      }));
      const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaintMaintenance/${reportDetails?.ID}`;
      await updateData(url, "PUT", token, copied);
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

  return (
    <View style={styles.container}>
      {isLoading && <PageLoading />}
      <Navbar navigation={navigation} />
      <View style={styles.view4}>
        <View style={styles.view1}>
          <Icon
            name="folder-multiple-plus"
            type="material-community"
            size={50}
            color="orange"
          />
        </View>
        <View style={styles.view5}>
          <Text style={styles.txt4}>
            {reportDetails?.Action === null
              ? "No result now please add Action"
              : reportDetails?.Action}
          </Text>
        </View>
        {isAddClicked && (
          <View style={styles.view7}>
            <View style={styles.view8}>
              <View style={styles.view9}>
                <Text style={styles.txt5}>Add Action</Text>
                <TouchableOpacity onPress={() => setIsAddClicked(false)}>
                  <Text style={styles.txt6}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  disabled={!action ? true : false}
                  style={{ opacity: !action ? 0.7 : 1 }}
                >
                  <Text style={styles.txt6}>Confirm</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.view11}>
                <View style={styles.view10}>
                  <TextInput
                    placeholder="Description"
                    value={action}
                    onChangeText={(e) => setAction(e)}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
        <View style={styles.view2}>
          <View style={styles.view6}>
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
    </View>
  );
};

export default Action;

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
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 10,
  },
  view6: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    // justifyContent: "center",
    // alignItems: "center",
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
    justifyContent: "center",
    gap: 20,
    backgroundColor: "orange",
    width: "90%",
    padding: 15,
    borderRadius: 5,
  },
  txt4: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  view7: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  view8: {
    height: "70%",
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
    gap: 40,
  },
});
