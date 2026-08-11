import { apiFetch } from './client.ts'

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  email: string;
}

export function signup(data: SignupRequest) {
  return apiFetch<SignupResponse>("/auth/signup/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}