import React, { useEffect, useState } from "react";
import { StyleSheet, Alert, View, TouchableOpacity, Text } from "react-native";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
// import registerNNPushToken from "native-notify";
// import * as app from "@react-native-firebase/app";

import { LoginContextProvider } from "./src/contexts/LoginContext";
import { LangContextProvider } from "./src/contexts/LangContext";
import RootNavigator from "./src/navigations/RootNavigator";
import { socket } from "./src/socket/socket";
import { FooterContextProvider } from "./src/contexts/FooterContext";
import { colors } from "./src/globals/styles";
import { registerForPushNotificationsAsync } from "./src/functions/registerPushNot";

export default function App() {
  // const [isNot, setIsNot] = useState(false);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  useEffect(() => {
    const register = async () => {
      try {
        await registerForPushNotificationsAsync();
      } catch (error) {
        console.log(error.message);
      }
    };
    register();
  }, []);

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => console.log(token));
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
      const notification = {
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data, // optional data payload
      };

      // Schedule the notification with a null trigger to show immediately
      await Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: null,
      });
    });

    const handlePushNotification = async (remoteMessage) => {
      const notification = {
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data, // optional data payload
      };

      // Schedule the notification with a null trigger to show immediately
      await Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: null,
      });
    };

    // Listen for push notifications when the app is in the foreground
    const unsubscribe = messaging().onMessage(handlePushNotification);

    return unsubscribe;
  }, []);

  // registerNNPushToken(12408, "oDLe3TKuWZlbElegUhVVvT");

  return (
    <FooterContextProvider>
      <LangContextProvider>
        <LoginContextProvider>
          <RootNavigator socket={socket} />
        </LoginContextProvider>
      </LangContextProvider>
    </FooterContextProvider>
  );
}

const styles = StyleSheet.create({
  view1: {
    position: "absolute",
    top: 0,
    height: 300,
    width: "100%",
    zIndex: 1000,
  },
  view2: {
    padding: 10,
    backgroundColor: "white",
    shadowColor: colors.grey2,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    borderRadius: 5,
  },
  view3: {
    backgroundColor: colors.grey3,
    borderRadius: 5,
    height: "20%",
  },
  view4: {
    height: "80%",
  },
});
