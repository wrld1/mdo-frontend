import "server-only";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getErrorMessage } from "./utils";

const accessKey = process.env.JWT_ACCESS_TOKEN_SECRET;

export async function decrypt(
  token: string | undefined = "",
  key: string | undefined = accessKey
) {
  const encodedKey = new TextEncoder().encode(key);
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    getErrorMessage(error);
  }
}

export async function updateAccessToken() {
  const refreshToken = cookies().get("refreshToken")?.value;

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const { accessToken } = await response.json();

    const payload = await decrypt(accessToken);

    cookies().set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      expires: payload?.exp,
      sameSite: "lax",
      path: "/",
    });

    return accessToken;
  } catch (error) {
    getErrorMessage(error);
    return null;
  }
}

export async function deleteTokens() {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
}
