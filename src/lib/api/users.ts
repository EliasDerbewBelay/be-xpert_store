import { apiClient } from "./client";
import type {
  EmailAvailabilityResponse,
  RegisterRequest,
  User,
} from "@/types";

export async function checkEmailAvailability(
  email: string
): Promise<EmailAvailabilityResponse> {
  return apiClient<EmailAvailabilityResponse>("/users/is-available", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function registerUser(
  data: RegisterRequest
): Promise<User> {
  // Ensure default avatar if not provided
  const payload = {
    ...data,
    avatar:
      data.avatar && data.avatar.trim().length > 0
        ? data.avatar
        : "https://picsum.photos/800",
  };

  return apiClient<User>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getUsers(options?: RequestInit): Promise<User[]> {
  const users = await apiClient<User[]>("/users", options);
  return Array.isArray(users) ? users : [];
}
