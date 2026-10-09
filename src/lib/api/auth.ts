import { apiClient } from "./client";
import type { LoginRequest, LoginResponse, User } from "@/types";

export async function login(
  credentials: LoginRequest
): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function getProfile(token: string): Promise<User> {
  return apiClient<User>("/auth/profile", {
    token,
  });
}

export async function refreshToken(
  token: string
): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/refresh-token", {
    method: "POST",
    body: JSON.stringify({ refreshToken: token }),
  });
}
