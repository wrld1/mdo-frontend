"use server";

import { decrypt } from "@/lib/auth";
import { getErrorMessage, timestampToDate } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";
import { cookies } from "next/headers";

interface VerifyAccountData {
	token: string;
}

export async function verifyAccountAction(
	verifyAccountData: VerifyAccountData,
) {
	try {
		const response = await fetchWithAutoErrorHandling(
			`${process.env.API_BASE_URL}/auth/verify`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(verifyAccountData),
			},
		);

		const responseData = await response.json();

		// if (responseData.accessToken) {
		// 	const { accessToken } = responseData;

		// 	const accessPayload = await decrypt(accessToken);

		// 	cookies().set("accessToken", accessToken, {
		// 		httpOnly: true,
		// 		expires: timestampToDate(accessPayload?.exp as number),
		// 	});

		// 	return { success: true };
		// }
	} catch (error) {
		const errorMessage = getErrorMessage(error);
		console.error("[VERIFY_ACCOUNT_ACTION]", errorMessage);

		return {
			error: getErrorMessage(error),
		};
	}
}
