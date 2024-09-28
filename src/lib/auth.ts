import "server-only";

import * as jose from "jose";
import { cookies } from "next/headers";
import { getErrorMessage } from "./utils";

export async function decrypt(token: string | undefined = "") {
  try {
    const payload = jose.decodeJwt(token);

    return payload;
  } catch (error) {
    getErrorMessage(error);
  }
}

export async function deleteTokens() {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
}
