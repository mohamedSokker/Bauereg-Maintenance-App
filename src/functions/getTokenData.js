import { Buffer } from "buffer";

export const getTokenData = async (token) => {
  try {
    const parts = token
      .split(".")
      .map((part) =>
        Buffer.from(
          part.replace(/-/g, "+").replace(/_/g, "/"),
          "base64"
        ).toString()
      );
    const payload = JSON.parse(parts[1]);
    return payload;
  } catch (error) {
    console.log(error.message);
    return null;
  }

  // console.log("JWT payload", payload.roles);
};
