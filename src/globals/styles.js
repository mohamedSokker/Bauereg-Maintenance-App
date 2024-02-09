import { getStatusBarHeight } from "react-native-status-bar-height";

// 44 - on iPhoneX
// 20 - on iOS device
// X - on Android platfrom (runtime value)
// 0 - on all other platforms (default)
//console.log(getStatusBarHeight());

// will be 0 on Android, because You pass true to skipAndroid
//console.log(getStatusBarHeight(true));

export const colors = {
  buttons: "#ff8c52",
  grey: "#bebebe",
  grey1: "#43484d",
  grey2: "#5e6977",
  grey3: "#86939e",
  grey4: "#bdc6cf",
  grey5: "#e1e8ee",
  grey6: "#eeeeee",
  grey7: "#F2f9f9",
  grey10: "#d6d6d6",
  lightgreen: "#66DF48",
  blue: "#286ef0",
  black: "#000000",
  white: "#ffffff",
  darkBlue: "#2d328a",
  logo: "rgb(0,74,128)",
  logo2: "rgba(0,74,128,0.1)",
};

export const parameters = {
  statusBarHeight: getStatusBarHeight(),
};

export const title = {
  color: "#ff8c52",
  fontSize: 20,
  fontWeight: "bold",
};
