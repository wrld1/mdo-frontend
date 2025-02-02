"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export interface GetDwellingsActionProps {
  pagination: { offset: number; limit: number };
  sort: { field: string; order: string };
  objectId?: string;
}

export async function getDwellingsAction({
  pagination: { offset, limit },
  sort: { field, order },
  objectId,
}: GetDwellingsActionProps) {
  try {
    let url = `${process.env.API_BASE_URL}/dwelling`;

    const queryParams = new URLSearchParams();
    if (offset !== undefined) {
      queryParams.append("offset", offset.toString());
    }
    if (limit !== undefined) {
      queryParams.append("limit", limit.toString());
    }

    if (field) {
      queryParams.append("sortBy", field);
    }
    if (order) {
      queryParams.append("sortOrder", order);
    }

    if (objectId) {
      queryParams.append("objectId", objectId);
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetchWithAutoErrorHandling(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const dwellings = await response.json();

    console.log("dwellings", dwellings);

    return dwellings;
  } catch (error) {
    console.log("[GET_DWELLINGS]", getErrorMessage(error));
    return error;
  }
}
