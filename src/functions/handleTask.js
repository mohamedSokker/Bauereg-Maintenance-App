import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";

import { EXPO_PUBLIC_BASE_URL } from "@env";

import { getUserData } from "./getUserData";
import { getTokenData } from "./getTokenData";
import fetchDataOnly from "./fetchDataOnly";
import updateData from "./updateData";
import { socket } from "../socket/socket";

const handleTask = async () => {
  const userInfo = await getUserData();
  const token = userInfo;
  const usersData = await getTokenData(token);
  console.log(`${usersData?.username} triggered`);
  console.log(socket.connected);
  if (!socket.connected) {
    console.log(`${usersData?.username} connecting`);
    await connectSocket();
    console.log(socket.connected);

    socket.on("connect_error", (err) => console.log(err.message));
    socket.on("appDataUpdate", handleNot);
    socket.on("userID", getUserId);
  }
};

const connectSocket = async () => {
  try {
    socket.connect();
  } catch (error) {
    console.log(error.message);
  }
};

const getUserId = async (data) => {
  const userInfo = await getUserData();
  if (userInfo) {
    const token = userInfo;
    const usersData = await getTokenData(token);
    socket.emit("userName", usersData?.username);
  }
};

const handleNot = async () => {
  try {
    const userInfo = await getUserData();
    if (userInfo) {
      const token = userInfo;
      const usersData = await getTokenData(token);
      const url = `${EXPO_PUBLIC_BASE_URL}/api/v1/appMaintGetNot?username=${usersData.username}`;
      let data = await fetchDataOnly(url, "POST", token);
      let query = "";
      if (!data) throw new Error("Error getting Data");
      for (let i = 0; i < data.length; i++) {
        // query = ` UPDATE AppNotification SET Sent = 'true' WHERE ID = '${data[i].ID}'`;

        // Notifications.setNotificationHandler({
        //   handleNotification: async () => ({
        //     shouldShowAlert: true,
        //     shouldPlaySound: false,
        //     shouldSetBadge: true,
        //   }),
        // });

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Check Problem`,
            body: data[i].Body,
            // data: { data: data[i].Category },
          },
          trigger: {
            seconds: 1,
          },
        });

        const urlUpdate = `${EXPO_PUBLIC_BASE_URL}/api/v1/appUpdateNot`;
        const notData = await updateData(urlUpdate, "PUT", token, {
          ID: data[i]?.ID,
        });
        // return BackgroundFetch.BackgroundFetchResult.NewData;
      }
      console.log("Finished");
    }
  } catch (error) {
    console.log(error.message);
  }
};

export default handleTask;
