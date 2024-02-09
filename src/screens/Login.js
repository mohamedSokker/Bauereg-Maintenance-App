import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useContext, useEffect } from "react";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";

import { EXPO_PUBLIC_BASE_URL } from "@env";

import { colors, parameters } from "../globals/styles";
import { dict } from "../dictionary";
import { LangContext } from "../contexts/LangContext";
import { LoginContext } from "../contexts/LoginContext";
import { getTokenData } from "../functions/getTokenData";
import updateData from "../functions/updateData";

const Login = ({ navigation }) => {
  const [error, setError] = useState(false);
  const [errorBody, setErrorBody] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { lang } = useContext(LangContext);
  const { setToken, setUsersData, setIsSignout } = useContext(LoginContext);

  const username = useRef(null);
  const password = useRef(null);

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
    const appExit = () => {
      BackHandler.exitApp();
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", appExit);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", appExit);
    };
  }, []);

  const checkFieldsEmpty = () => {
    if (!username?.current?.value || !password?.current?.value) {
      return true;
    } else {
      return false;
    }
  };

  const handleLogin = async () => {
    if (checkFieldsEmpty()) {
      setError(true);
      setErrorBody(dict[lang].emptyError);
    } else {
      setIsLoading(true);
      setError(false);
      try {
        const res = await fetch(`${EXPO_PUBLIC_BASE_URL}/appLogin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.current.value,
            password: password.current.value,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message);
        } else {
          if (data) {
            AsyncStorage.setItem("token", data.token);
            setToken(data.token);
            setIsSignout(false);
            const userInfo = await getTokenData(data.token);
            setUsersData(userInfo);
            setIsSuccess(true);
            if (requestUserPermission()) {
              messaging()
                .getToken()
                .then(async (token) => {
                  console.log(token);
                  const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appManageUsers/${userInfo.id}`;
                  await updateData(url, "PUT", "", { Token: token });
                })
                .catch((err) => console.log(err.message));
            } else {
              console.log(`Failed token status ${authStatus}`);
            }
            navigation.navigate("Home");
          }
        }
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
        setErrorBody(`${error.message}`);
        setInterval(() => setError(false), 20000);
      }
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.view6}>
          <View style={styles.view7}>
            <Text>Loading</Text>
            <ActivityIndicator size={20} color={colors.logo} />
          </View>
        </View>
      )}
      {isSuccess && (
        <View style={styles.view4}>
          <View style={[styles.view5, { backgroundColor: "green" }]}>
            <Text style={styles.txt2}>{dict[lang].successfulyLogin}</Text>
          </View>
        </View>
      )}
      {error && (
        <View style={styles.view4}>
          <View style={[styles.view5, { backgroundColor: "red" }]}>
            <Text style={styles.txt2}>{errorBody}</Text>
          </View>
        </View>
      )}
      <Text style={styles.txt}>{dict[lang].login}</Text>
      <View style={styles.view1}>
        <Icon
          name="account-outline"
          type="material-community"
          size={26}
          color="orange"
        />
        <TextInput
          style={styles.txtInput}
          ref={username}
          onChangeText={(e) => (username.current.value = e)}
        />
      </View>
      <View style={styles.view2}>
        <Icon
          name="lock-outline"
          type="material-community"
          size={28}
          color="orange"
        />
        <TextInput
          style={styles.txtInput}
          secureTextEntry={true}
          ref={password}
          onChangeText={(e) => (password.current.value = e)}
        />
      </View>
      <View style={styles.view3}>
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.txt1}>{dict[lang].signIn}</Text>
        </TouchableOpacity>
      </View>
      <StatusBar
        style="light"
        backgroundColor={colors.grey2}
        translucent={true}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.logo,
    paddingTop: parameters.statusBarHeight,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    zIndex: 1,
  },
  txt: {
    fontSize: 26,
    fontWeight: "500",
    color: "orange",
  },
  view1: {
    position: "relative",
    zIndex: 1,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    zIndex: 1,
    borderColor: colors.white,
    borderRadius: 100,
  },
  view2: {
    position: "relative",
    zIndex: 1,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    zIndex: 1,
    borderColor: colors.white,
    borderRadius: 100,
  },
  view3: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  view4: {
    marginTop: parameters.statusBarHeight,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 60,
    padding: 8,
    paddingHorizontal: 12,
  },
  view5: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  txtInput: {
    width: "80%",
    height: "70%",
    padding: 2,
    paddingLeft: 12,
    color: colors.white,
  },
  btn: {
    backgroundColor: colors.grey3,
    borderRadius: 100,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  txt1: {
    fontSize: 20,
    fontWeight: "400",
    color: colors.logo,
  },
  txt2: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
  view6: {
    position: "absolute",
    zIndex: 100,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    top: parameters.statusBarHeight,
  },
  view7: {
    backgroundColor: colors.white,
    shadowColor: colors.grey2,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    paddingHorizontal: 30,
    paddingVertical: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
