import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SelectEquipment from "../screens/SelectEquipment";
import Reports from "../screens/Reports";
import ScanCode from "../screens/ScanCode";
import SelectIssue from "../screens/SelectIssue";
import QrCode from "../screens/QrCode";
import MaintTime from "../screens/MaintTime";
import FinishReport from "../screens/FinishReport";
import ScanSparePart from "../screens/ScanSparePart";
import Problem from "../screens/Problem";
import Action from "../screens/Action";
import ReportsQrCode from "../screens/ReportsQrCode";
import Notifications from "../screens/Notifications";
import AddUser from "../screens/AddUser";

const MainStack = createNativeStackNavigator();

export function HomeStack({ socket, userID }) {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Reports" options={{ headerShown: false }}>
        {(props) => <Reports {...props} socket={socket} />}
      </MainStack.Screen>
      <MainStack.Screen name="ReportsQrCode" options={{ headerShown: false }}>
        {(props) => (
          <ReportsQrCode {...props} socket={socket} userID={userID} />
        )}
      </MainStack.Screen>
      <MainStack.Screen name="SelectEquipment" options={{ headerShown: false }}>
        {(props) => <SelectEquipment {...props} socket={socket} />}
      </MainStack.Screen>
      <MainStack.Screen name="ScanCode" options={{ headerShown: false }}>
        {(props) => <ScanCode {...props} socket={socket} userID={userID} />}
      </MainStack.Screen>
      <MainStack.Screen name="SelectIssue" options={{ headerShown: false }}>
        {(props) => <SelectIssue {...props} socket={socket} />}
      </MainStack.Screen>
      <MainStack.Screen name="QrCode" options={{ headerShown: false }}>
        {(props) => <QrCode {...props} socket={socket} userID={userID} />}
      </MainStack.Screen>
      <MainStack.Screen name="MaintTime" options={{ headerShown: false }}>
        {(props) => <MaintTime {...props} socket={socket} userID={userID} />}
      </MainStack.Screen>
      <MainStack.Screen name="FinishReport" options={{ headerShown: false }}>
        {(props) => <FinishReport {...props} socket={socket} userID={userID} />}
      </MainStack.Screen>
      <MainStack.Screen name="ScanSparePart" options={{ headerShown: false }}>
        {(props) => (
          <ScanSparePart {...props} socket={socket} userID={userID} />
        )}
      </MainStack.Screen>
      <MainStack.Screen name="Problem" options={{ headerShown: false }}>
        {(props) => <Problem {...props} socket={socket} userID={userID} />}
      </MainStack.Screen>
      <MainStack.Screen name="Action" options={{ headerShown: false }}>
        {(props) => <Action {...props} socket={socket} userID={userID} />}
      </MainStack.Screen>
      <MainStack.Screen name="Notifications" options={{ headerShown: false }}>
        {(props) => (
          <Notifications {...props} socket={socket} userID={userID} />
        )}
      </MainStack.Screen>
      <MainStack.Screen name="AddUser" options={{ headerShown: false }}>
        {(props) => <AddUser {...props} socket={socket} userID={userID} />}
      </MainStack.Screen>
    </MainStack.Navigator>
  );
}
