import "server-only";

import { cookies } from "next/headers";
import { decrypt, updateAccessToken } from "./auth";
import { cache } from "react";
import { getErrorMessage } from "./utils";

export const getUser = cache(async () => {
  try {
    let cookie = cookies().get("accessToken")?.value;
    let token = await decrypt(cookie);

    if (!token) {
      const newAccessToken = await updateAccessToken();

      if (newAccessToken) {
        token = await decrypt(newAccessToken);
      }
    }
    const userId = (token?.uId as number) ?? null;

    if (!userId) {
      return { isAuth: false, userId: null };
    }

    return { isAuth: true, userId };
  } catch (error) {
    getErrorMessage(error);
    return { isAuth: false, userId: null };
  }
});

//pomenyat na verifyToken()
