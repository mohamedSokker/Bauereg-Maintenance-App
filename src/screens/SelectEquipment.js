import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Icon } from "react-native-elements";
import { RadioButton } from "react-native-paper";

import { EXPO_PUBLIC_BASE_URL } from "@env";

import { colors } from "../globals/styles";
import { FooterContext } from "../contexts/FooterContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LoginContext } from "../contexts/LoginContext";
import updateData from "../functions/updateData";
import PageLoading from "../components/PageLoading";

const SelectEquipment = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

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
    setFieldsData,
    fieldsData,
    usersData,
    token,
    setError,
    setErrorBody,
  } = useContext(LoginContext);

  // const [checked, setChecked] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [eq, setEq] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        if (usersData) {
          setIsLoading(true);
          const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appGetEqs`;
          const data = await updateData(url, "POST", token, {
            Location: usersData?.Location,
            Equipment_Type: usersData?.eqtype,
          });
          setEq(data);
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
    getData();
  }, [usersData]);

  React.useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", (e) => {
      setIsFooter(true);
    });

    return unsubscribe;
  }, [navigation]);

  const data = [usersData?.Equipment];
  return (
    <View style={styles.container}>
      {isLoading && <PageLoading />}
      <Navbar navigation={navigation} />
      <View style={styles.view1}>
        <Text style={styles.txt1}>Select Equipment</Text>
      </View>
      <View style={styles.view2}>
        <TouchableOpacity
          style={styles.btn2}
          onPress={() => setIsClicked(true)}
        >
          <Text style={styles.txt3}>
            {!fieldsData.Equipment ? "Select Equipment" : fieldsData.Equipment}
          </Text>
          <Icon
            name="caret-down-outline"
            type="ionicon"
            size={16}
            color="orange"
          />
        </TouchableOpacity>
        {isClicked && (
          <View style={styles.view3}>
            <ScrollView style={styles.view4}>
              {eq?.map((d) => (
                <View
                  key={d.ID}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                    paddingBottom: 5,
                    paddingLeft: 10,
                  }}
                >
                  <RadioButton
                    value={d.Equipment}
                    status={
                      fieldsData.Equipment === d.Equipment
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => {
                      // setChecked(d);
                      // setEq(d);
                      const copied = [...eq];
                      const loc = copied.find(
                        (e) => e.Equipment === d.Equipment
                      );
                      console.log(loc);
                      setFieldsData((prev) => ({
                        ...prev,
                        Location: [loc.Location],
                        Equipment: d.Equipment,
                        Equipment_Model: d.Equipment.split("#")[0].trim(),
                      }));
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.grey3,
                      fontWeight: "400",
                    }}
                  >
                    {d.Equipment}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.view5}>
              <TouchableOpacity
                style={styles.btn3}
                onPress={() => {
                  setIsClicked(false);
                  // setEq(null);
                  setFieldsData((prev) => ({ ...prev, Equipment: null }));
                  // setChecked(null);
                }}
              >
                <Text style={styles.txt4}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn3}
                onPress={() => {
                  setIsClicked(false);
                }}
              >
                <Text style={styles.txt4}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <View>
        <TouchableOpacity
          style={[styles.btn1, { opacity: fieldsData.Equipment ? 1 : 0.7 }]}
          disabled={fieldsData.Equipment ? false : true}
          onPress={() => navigation.navigate("SelectIssue")}
        >
          <Text style={styles.txt2}>Next</Text>
        </TouchableOpacity>
      </View>
      <Footer navigation={navigation} />
    </View>
  );
};

export default SelectEquipment;

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
  btn1: {
    backgroundColor: colors.logo,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 4,
  },
  txt2: {
    fontSize: 16,
    color: colors.white,
  },
  view2: {
    padding: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  btn2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 4,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: colors.grey4,
  },
  txt3: {
    fontSize: 20,
    color: colors.logo,
    opacity: 0.6,
  },
  view3: {
    height: 300,
    width: 250,
    backgroundColor: colors.grey6,
    position: "absolute",
    zIndex: 100,
    top: 0,
    paddingVertical: 40,
  },
  view4: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.grey4,
    height: "70%",
    backgroundColor: colors.white,
    // padding: 10,
  },
  view5: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 10,
  },
  btn3: {
    backgroundColor: "orange",
    width: 80,
    height: 35,
    padding: 10,
    paddingVertical: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  txt4: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.logo,
  },
});
