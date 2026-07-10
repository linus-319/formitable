import { apiFetch } from "./client";

export interface HelloResponse {
  message: string;
}

export function getHello() {
  return apiFetch<HelloResponse>("/hello/");
}