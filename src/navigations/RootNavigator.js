import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
// import { HomeStack } from "./HomeStaack";
import DrawerNavigator from "./DrawerNavigator";

export default function RootNavigator({ socket }) {
  return (
    <NavigationContainer>
      {/* <HomeStack socket={socket} /> */}
      <DrawerNavigator socket={socket} />
    </NavigationContainer>
  );
}
