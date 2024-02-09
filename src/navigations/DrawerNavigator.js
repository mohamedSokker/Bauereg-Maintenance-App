import * as React from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createDrawerNavigator,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "../globals/styles";
import { HomeStack } from "./HomeStaack";
import Profile from "../screens/Profile";
import ManPower from "../screens/ManPower";
import ProjectStatus from "../screens/ProjectStatus";
import Login from "../screens/Login";
import { LoginContext } from "../contexts/LoginContext";
import { LangContext } from "../contexts/LangContext";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({ socket, navigation }) {
  const { setIsLoading, setToken, setUsersData } =
    React.useContext(LoginContext);
  const { setLang } = React.useContext(LangContext);
  return (
    <Drawer.Navigator
      screenOptions={{ drawerStyle: { backgroundColor: colors.logo } }}
      drawerContent={(props) => {
        return (
          <SafeAreaView style={{ height: "100%" }}>
            <View
              style={{
                position: "absolute",
                bottom: 100,
                width: "100%",
                height: 100,
                justifyContent: "center",
                alignItems: "center",
                gap: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 20,
                  width: "100%",
                  borderBottomWidth: 1,
                  borderBottomColor: "orange",
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    gap: 20,
                    width: "100%",
                    padding: 20,
                  }}
                  onPress={() => {
                    AsyncStorage.removeItem("token");
                    socket.disconnect();
                    setIsLoading(true);
                    setUsersData(null);
                    setToken(null);
                  }}
                >
                  <Icon
                    type="ionicon"
                    name="log-out-outline"
                    color={`orange`}
                    size={35}
                  />
                  <Text style={{ fontSize: 20, color: "white" }}>Logout</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  width: "100%",
                  paddingLeft: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                }}
                onPress={() => setLang("Ar")}
              >
                <Image
                  source={require("../../assets/Ar.jpg")}
                  style={{ width: 30, height: 20 }}
                />
                <Text style={{ fontSize: 20, color: "white" }}>Ar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "100%",
                  paddingLeft: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                }}
                onPress={() => setLang("En")}
              >
                <Image
                  source={require("../../assets/En.png")}
                  style={{ width: 30, height: 20 }}
                />
                <Text style={{ fontSize: 20, color: "white" }}>En</Text>
              </TouchableOpacity>
            </View>
            <DrawerItemList {...props} />
          </SafeAreaView>
        );
      }}
    >
      <Drawer.Screen
        name="HomeStack"
        // component={HomeStack}
        options={{
          drawerIcon: ({ focussed, size }) => (
            <Icon
              type="ionicon"
              name="home-outline"
              color={`orange`}
              size={35}
            />
          ),
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? "orange" : "white", fontSize: 20 }}>
              Home
            </Text>
          ),
          headerShown: false,
        }}
      >
        {(props) => <HomeStack {...props} socket={socket} />}
      </Drawer.Screen>
      {/* <Drawer.Screen
        name="Profile"
        // component={Profile}
        options={{
          title: "Profile",
          drawerIcon: ({ focussed, size }) => (
            <Icon
              type="ionicon"
              name="person-circle-outline"
              color={`orange`}
              size={35}
            />
          ),
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? "orange" : "white", fontSize: 20 }}>
              Profile
            </Text>
          ),
          headerShown: false,
        }}
      >
        {(props) => <Profile {...props} socket={socket} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Project Status"
        // component={ProjectStatus}
        options={{
          title: "Project Status",
          drawerIcon: ({ focussed, size }) => (
            <Icon
              type="ionicon"
              name="lock-closed-outline"
              color={`orange`}
              size={35}
            />
          ),
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? "orange" : "white", fontSize: 20 }}>
              Project Status
            </Text>
          ),
          headerShown: false,
        }}
      >
        {(props) => <ProjectStatus {...props} socket={socket} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Man Power"
        // component={ManPower}
        options={{
          title: "Man Power",
          drawerIcon: ({ focussed, size }) => (
            <Icon
              type="ionicon"
              name="people-circle-outline"
              color={`orange`}
              size={35}
            />
          ),
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? "orange" : "white", fontSize: 20 }}>
              Man Power
            </Text>
          ),
          headerShown: false,
        }}
      >
        {(props) => <ManPower {...props} socket={socket} />}
      </Drawer.Screen> */}
      {/* <Drawer.Screen
        name="Logout"
        // component={Logout}
        options={{
          title: "Logout",
          drawerIcon: ({ focussed, size }) => (
            <Icon
              type="ionicon"
              name="log-out-outline"
              color={`orange`}
              size={35}
            />
          ),
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? "orange" : "white", fontSize: 20 }}>
              Logout
            </Text>
          ),
          headerShown: false,
        }}
      >
        {(props) => <Logout {...props} socket={socket} />}
      </Drawer.Screen> */}
    </Drawer.Navigator>
  );
}
