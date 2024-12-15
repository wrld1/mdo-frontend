"use server";

import { getErrorMessage } from "@/lib/utils";
import { fetchWithAutoErrorHandling } from "@/utils/functions.server";

export interface GetObjectsActionProps {
  pagination: { offset: number; limit: number };
  sort: { field: string; order: string };
}

export async function getObjectsAction({
  pagination: { offset, limit },
  sort: { field, order },
}: GetObjectsActionProps) {
  try {
    let url = `${process.env.API_BASE_URL}/object`;

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

    const objects = await response.json();

    // console.log("objects", objects);

    return objects;
  } catch (error) {
    console.log("[GET_OBJECTS]", getErrorMessage(error));
    return error;
  }
}
