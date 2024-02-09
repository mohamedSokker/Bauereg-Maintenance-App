import { EXPO_PUBLIC_FCM_SERVER_KEY } from "@env";

const sendMessage = async (tokens, title, message) => {
  try {
    const data = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${EXPO_PUBLIC_FCM_SERVER_KEY}`,
      },
      body: JSON.stringify({
        registration_ids: tokens,
        priority: "high",
        data: {
          experienceId: "BauerEg/BauerEg",
          scopeKey: "BauerEg/BauerEg",
          title: title,
          message: message,
        },
      }),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export default sendMessage;
