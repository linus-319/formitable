import { apiFetch } from './client.ts';

export interface Organization {
    id: number,
    name: string,
}

export function getOrganizations() {
    return apiFetch<Organization[]>("/organizations/")
}