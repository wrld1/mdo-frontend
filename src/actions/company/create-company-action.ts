"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

interface CreateCompanyFormData {
	companyCode: number;
	companyType: string;
	email: string;
	password: string;
	repeatPassword: string;
	companyName?: string;
}

export async function createCompanyAction(
	createCompanyFormData: CreateCompanyFormData,
) {
	const { companyCode, companyType, email, password, companyName } =
		createCompanyFormData;

	try {
		const companyPayload: { code: number; type: string; name?: string } = {
			code: companyCode,
			type: companyType,
		};

		if (companyName) {
			companyPayload.name = companyName;
		}

		const userResponse = await fetchWithAutoErrorHandling(
			`${process.env.API_BASE_URL}/auth/sign-up`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
					company: companyPayload,
				}),
			},
		);
	} catch (error) {
		const errorMessage = getErrorMessage(error);
		console.error("[CREATE_COMPANY_ACTION]", errorMessage);
		return {
			error: getErrorMessage(error),
		};
	}
}
