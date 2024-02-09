import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import Checkbox from "expo-checkbox";
import React, { useContext, useState, useEffect } from "react";

import {
  EXPO_PUBLIC_BC_ABS_PATH,
  EXPO_PUBLIC_BG_ABS_PATH,
  EXPO_PUBLIC_BC_REL_PATH,
  EXPO_PUBLIC_BG_REL_PATH,
  EXPO_PUBLIC_BASE_URL,
} from "@env";

import { colors } from "../globals/styles";
import { LoginContext } from "../contexts/LoginContext";
import fetchDataOnly from "../functions/fetchDataOnly";
import { FooterContext } from "../contexts/FooterContext";
import { formatDate } from "../functions/formatDate";
import updateData from "../functions/updateData";
import Navbar from "../components/Navbar";
import PageLoading from "../components/PageLoading";

const SelectIssue = ({ navigation, socket }) => {
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

  const {
    usersData,
    token,
    setFieldsData,
    fieldsData,
    setReportData,
    setError,
    setErrorBody,
  } = useContext(LoginContext);
  const { setIsFooter } = useContext(FooterContext);

  // const [issue, setIssue] = useState([]);
  const [filesItems, setFilesItems] = useState([]);
  const [path, setPath] = useState("");
  const [relPath, setRelPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  React.useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", (e) => {
      setIsFooter(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (path !== "") {
          setIsLoading(true);
          const url = `${EXPO_PUBLIC_BASE_URL}/AppGetFiles?fullpath=${path}`;
          const data = await fetchDataOnly(url, "GET", token);
          setFilesItems(data.data);
          setIsLoading(false);
        }
      } catch (err) {
        setError(true);
        setErrorBody(err.message);
        setTimeout(() => {
          setError(false);
        }, 3000);
        setIsLoading(false);
      }
    };
    getData();
  }, [usersData, path]);

  const getDatas = async () => {
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
    if (usersData.eqtype === "Trench_Cutting_Machine") {
      setPath(EXPO_PUBLIC_BC_ABS_PATH);
      setRelPath(EXPO_PUBLIC_BC_REL_PATH);
    } else {
      setPath(EXPO_PUBLIC_BG_ABS_PATH);
      setRelPath(EXPO_PUBLIC_BG_REL_PATH);
    }
  }, []);

  const getDate = (date) => {
    const dt = new Date(date);
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
    return dt.toISOString();
  };

  const getDate1 = (date) => {
    const dt = new Date(date);
    dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
    return dt.toISOString();
  };

  const getDate2 = (date) => {
    const dt = new Date(date);
    dt.setMinutes(dt.getMinutes());
    return dt.toISOString();
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const serverurl = `${EXPO_PUBLIC_BASE_URL}/api/v1/getServerDate`;
      const result = await updateData(serverurl, "POST", token, {});
      let copyData = { ...fieldsData };
      copyData = {
        ...copyData,
        Date_Time: formatDate(new Date()),
        Location: JSON.parse(usersData?.Location),
        Equipment_Type: usersData.eqtype,
        ProblemCreatedBy: usersData?.username,
        Problem_start_From: new Date(result[0]?.Date),
        Status: `Under Maintenance`,
        Seen: "false",
        Sent: "false",
      };
      const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaintMaintenance`;
      await updateData(url, "POST", token, copyData);
      setFieldsData(copyData);
      setFieldsData((prev) => ({
        ...prev,
        Problem_start_From: getDate2(prev.Problem_start_From),
      }));
      await getDatas();
      const bodyData = {
        type: "newIssue",
        Location: JSON.parse(usersData?.Location),
        username: usersData?.username,
        ProfileImg: usersData?.img,
        Equipment: copyData?.Equipment,
        Breakdown_Type: copyData?.Breakdown_Type[0]?.split(".")[0],
        Problem_start_From: `${new Date(
          getDate1(copyData?.Problem_start_From)
        ).toLocaleString()}`,
        Equipment_Type: usersData?.eqtype,
      };
      const notURL = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaintNotification`;
      await updateData(notURL, "POST", token, bodyData);
      const usersURL = `${EXPO_PUBLIC_BASE_URL}/api/v1/appGetUsersInSite`;
      const tokenInsites = await updateData(usersURL, "POST", token, {
        Location: JSON.parse(usersData.Location),
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
        title: `check problem`,
        body: `Equipment ${copyData?.Equipment} has Problem ${
          copyData?.Breakdown_Type[0]?.split(".")[0]
        } at ${new Date(
          getDate1(copyData?.Problem_start_From)
        ).toLocaleString()}`,
        Tokens: targetTokens,
      };
      const res = await updateData(messageURL, "POST", token, messageBody);
      console.log(res);

      socket.emit("updateAppData", "");
      navigation.navigate("QrCode");
      setIsLoading(false);
    } catch (error) {
      setError(true);
      setErrorBody(error.message);
      setTimeout(() => {
        setError(false);
      }, 5000);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <PageLoading />}
      <Navbar navigation={navigation} />
      <View style={styles.view1}>
        <Text style={styles.txt1}>Select Issue</Text>
      </View>

      <ScrollView style={styles.scrollView1}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {path !== "" &&
            filesItems.map((item) => (
              <View style={styles.view2} key={item?.file}>
                <Image
                  source={{
                    uri: `${EXPO_PUBLIC_BASE_URL}/${relPath}/${item?.file}`,
                  }}
                  style={styles.img1}
                />
                <Text>{item?.file.split(".")[0]}</Text>
                <Checkbox
                  value={fieldsData?.Breakdown_Type?.includes(item?.file)}
                  onValueChange={() => {
                    if (fieldsData?.Breakdown_Type?.includes(item?.file)) {
                      let copy = fieldsData?.Breakdown_Type;
                      copy = copy.filter((d) => d !== item?.file);
                      // setIssue(copy);
                      setFieldsData((prev) => ({
                        ...prev,
                        Breakdown_Type: copy,
                      }));
                    } else {
                      // setIssue((prev) => [...prev, item?.file]);
                      setFieldsData((prev) => ({
                        ...prev,
                        Breakdown_Type: [...prev[`Breakdown_Type`], item?.file],
                      }));
                    }
                  }}
                  color={
                    fieldsData?.Breakdown_Type?.includes(item?.file)
                      ? "#4630EB"
                      : undefined
                  }
                />
              </View>
            ))}

          <View style={{ width: "90%", marginTop: 100 }}>
            <TouchableOpacity
              style={[
                styles.btn1,
                { opacity: fieldsData?.Breakdown_Type?.length === 0 ? 0.7 : 1 },
              ]}
              disabled={fieldsData?.Breakdown_Type?.length === 0 ? true : false}
              onPress={handleSave}
            >
              <Text style={styles.txt2}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SelectIssue;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: "relative",
    alignItems: "center",
  },
  view1: {
    padding: 30,
  },
  txt1: {
    fontSize: 20,
    color: colors.logo,
  },
  scrollView1: {},
  view2: {
    width: "48%",
    // height: 180,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  img1: {
    width: 140,
    height: 140,
  },
  btn1: {
    backgroundColor: colors.logo,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  txt2: {
    fontSize: 16,
    color: "orange",
    fontWeight: "500",
  },
});
