import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Something went wrong";
  }

  return message;
}

export async function fetchWithAutoErrorHandling(
  url: string,
  options: RequestInit | undefined
) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorResponse = await response.json();
    const errorMessage = errorResponse.message || "Unknown error occurred";
    throw new Error(errorMessage);
  }

  return response;
}
