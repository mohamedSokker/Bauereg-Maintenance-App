import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Icon } from "react-native-elements";

import { colors } from "../globals/styles";
// import { HomeStack } from "./HomeStaack";
import Reports from "../screens/Reports";
import SelectEquipment from "../screens/SelectEquipment";
import ScanCode from "../screens/ScanCode";
import SelectIssue from "../screens/SelectIssue";
import QrCode from "../screens/QrCode";
// import Home from "../screens/Home";
const Drawer = createDrawerNavigator();

export default function DrawerMainNavigator({ socket }) {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: colors.white },
      }}
    >
      <Drawer.Screen
        name="Reports"
        options={{
          title: "Reports",
          drawerIcon: ({ focussed, size }) => (
            <Icon
              type="material-community"
              name="home"
              color={`orange`}
              size={35}
            />
          ),
          headerShown: false,
        }}
      >
        {(props) => <Reports {...props} socket={socket} />}
      </Drawer.Screen>
      <Drawer.Screen name="SelectEquipment" options={{ headerShown: false }}>
        {(props) => <SelectEquipment {...props} socket={socket} />}
      </Drawer.Screen>
      <Drawer.Screen name="ScanCode" options={{ headerShown: false }}>
        {(props) => <ScanCode {...props} socket={socket} />}
      </Drawer.Screen>
      <Drawer.Screen name="SelectIssue" options={{ headerShown: false }}>
        {(props) => <SelectIssue {...props} socket={socket} />}
      </Drawer.Screen>
      <Drawer.Screen name="QrCode" options={{ headerShown: false }}>
        {(props) => <QrCode {...props} socket={socket} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
