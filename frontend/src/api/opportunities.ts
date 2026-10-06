import { apiFetch } from './client';

export interface Opportunity {
    id: number,
    organization: number,
    name: string,
    description: string,
    status: 'open' | 'closed',
    deadline: string | null,
    created_at: string,
    updated_at: string,
}

interface CreateOpportunityData {
    name: string,
    description: string,
    status: 'open' | 'closed',
    deadline: string | null,
}

export function getOpportunities(id: number) {
    return apiFetch<Opportunity[]>(`/organizations/${id}/opportunities/`)
}

export function createOpportunity(organizationId: number, data: CreateOpportunityData) {
    return apiFetch<Opportunity>(
        `/organizations/${organizationId}/opportunities/`,
        {
            method: 'POST',
            body: JSON.stringify(data),
        }
    );
}

export function updateOpportunity(
    organizationId: number,
    opportunityId: number,
    data: CreateOpportunityData
) {
    return apiFetch<Opportunity>(
        `/organizations/${organizationId}/opportunities/${opportunityId}/`,
        {
            method: 'PATCH',
            body: JSON.stringify(data),
        }
    );
}

export function deleteOpportunity(
    organizationId: number,
    opportunityId: number,
) {
    return apiFetch<void>(
        `/organizations/${organizationId}/opportunities/${opportunityId}/`,
        {
            method: 'DELETE',
        }
    );
}