import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";

import Home from "../screens/Home";
import Login from "../screens/Login";
import Splash from "../screens/Splash";
import { LoginContext } from "../contexts/LoginContext";

const HomeNav = createNativeStackNavigator();

export function HomeStack({ socket }) {
  const { isLoading, token } = useContext(LoginContext);
  if (isLoading) return <Splash />;
  return (
    <HomeNav.Navigator>
      {token ? (
        <HomeNav.Screen name="Home" options={{ headerShown: false }}>
          {(props) => <Home {...props} socket={socket} />}
        </HomeNav.Screen>
      ) : (
        <HomeNav.Screen name="Login" options={{ headerShown: false }}>
          {(props) => <Login {...props} socket={socket} />}
        </HomeNav.Screen>
      )}
    </HomeNav.Navigator>
  );
}
