import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Icon } from "react-native-elements";

import { EXPO_PUBLIC_BASE_URL } from "@env";

import { colors } from "../globals/styles";
import PageLoading from "../components/PageLoading";
import Navbar from "../components/Navbar";
import updateData from "../functions/updateData";
import { LoginContext } from "../contexts/LoginContext";

const Notifications = ({ navigation }) => {
  const { token, setError, setErrorBody, usersData } = useContext(LoginContext);

  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

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

  useEffect(() => {
    const getnotifications = async () => {
      try {
        setIsLoading(true);
        const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaint_getNotification?username=${usersData.username}`;
        const notificationData = await updateData(url, "POST", token, {});
        setNotifications(notificationData);
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
    getnotifications();
  }, []);
  return (
    <View style={styles.container}>
      {isLoading && <PageLoading />}
      <Navbar navigation={navigation} />
      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.veiw1}>
          <View>
            <Icon
              name="notifications-outline"
              type="ionicon"
              size={50}
              color={colors.logo}
            />
          </View>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.ID}
              style={[
                styles.btn1,
                {
                  backgroundColor:
                    notification.Seen === "false" ? colors.logo : colors.grey5,
                },
              ]}
            >
              <Text style={styles.txt1}>{notification.Body}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: "relative",
    alignItems: "center",
  },
  veiw1: {
    justifyContent: "center",
    padding: 10,
    alignItems: "center",
    gap: 10,
  },
  btn1: {
    padding: 15,
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  txt1: {
    fontSize: 16,
    fontWeight: "800",
    color: "orange",
  },
});
