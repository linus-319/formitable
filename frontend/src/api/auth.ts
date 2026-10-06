import { apiFetch, getCsrfToken } from './client.ts'

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  id: number;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
}

export interface MeResponse {
  id: number;
  email: string;
}

export interface LogoutResponse {
  message: string;
}

export function signup(data: SignupRequest) {
  return apiFetch<SignupResponse>("/auth/signup/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data: LoginRequest) {
  return apiFetch<LoginResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCurrentUser() {
  return apiFetch<MeResponse>("/auth/me/");
}

export function logout() {
  return apiFetch<LogoutResponse>("/auth/logout/", {
    method: "POST",
  });
}

export { getCsrfToken };