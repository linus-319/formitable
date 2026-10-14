import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Organization } from '../api/organizations';
import type { Opportunity } from '../api/opportunities';
import { getOpportunities, deleteOpportunity } from '../api/opportunities';
import DashboardPage from './DashboardPage';

vi.mock('../api/opportunities', () => ({
    getOpportunities: vi.fn(),
    deleteOpportunity: vi.fn(),
}));

vi.mock('../context/useAuth', () => ({
    useAuth: () => ({
        user: {
            id: 1,
            email: 'test@example.com',
        },
    }),
}));

vi.mock('../components/OpportunityList', () => ({
    default: ({
        opportunities,
        onDelete,
    }: {
        opportunities: Opportunity[];
        onDelete: (opportunity: Opportunity) => void | Promise<void>;
    }) => (
        <ul>
            {opportunities.map((opportunity) => (
                <li key={opportunity.id}>
                    <span>{opportunity.name}</span>
                    <button onClick={() => onDelete(opportunity)}>
                        Delete {opportunity.name}
                    </button>
                </li>
            ))}
        </ul>
    ),
}));

vi.mock('../components/OpportunityForm', () => ({
    default: () => <div>Opportunity form</div>,
}));

vi.mock('../components/LogoutButton', () => ({
    default: () => <button>Log out</button>,
}));

vi.mock('../components/OrganizationSelector', () => ({
    default: ({
        handleSelectOrganization,
    }: {
        handleSelectOrganization: (org: Organization) => void;
    }) => (
        <div>
            <button
                onClick={() =>
                    handleSelectOrganization({
                        id: 1,
                        name: 'Formitable Foundation',
                    })
                }
            >
                Formitable Foundation
            </button>

            <button
                onClick={() =>
                    handleSelectOrganization({
                        id: 2,
                        name: 'Community Arts',
                    })
                }
            >
                Community Arts
            </button>
        </div>
    ),
}));

describe('DashboardPage opportunity', () => {
    const foundationOpportunities: Opportunity[] = [
        {
            id: 101,
            organization: 1,
            name: 'Community Grant',
            description: 'Funding for community projects',
            status: 'open',
            deadline: null,
            created_at: '2026-10-01T12:00:00Z',
            updated_at: '2026-10-01T12:00:00Z',
        },
        {
            id: 102,
            organization: 1,
            name: 'Arts Fellowship',
            description: 'Support for local artists',
            status: 'closed',
            deadline: null,
            created_at: '2026-10-02T12:00:00Z',
            updated_at: '2026-10-02T12:00:00Z',
        },
    ];

    const artsOpportunities: Opportunity[] = [
        {
            id: 201,
            organization: 2,
            name: 'Youth Arts Program',
            description: 'Arts programming for young people',
            status: 'open',
            deadline: null,
            created_at: '2026-10-03T12:00:00Z',
            updated_at: '2026-10-03T12:00:00Z',
        },
    ];

    beforeEach(() => {
        vi.mocked(getOpportunities).mockReset();
        vi.mocked(deleteOpportunity).mockReset();
    });

    describe('loading', () => {
        it('does not load opportunities before an organization is selected', () => {
            render(<DashboardPage />);

            expect(getOpportunities).not.toHaveBeenCalled();
        });

        it('loads and displays opportunities for the selected organization', async () => {
            const user = userEvent.setup();

            vi.mocked(getOpportunities).mockResolvedValue(
                foundationOpportunities
            );

            render(<DashboardPage />);

            await user.click(
                screen.getByRole('button', {
                    name: 'Formitable Foundation',
                })
            );

            expect(getOpportunities).toHaveBeenCalledWith(1);

            expect(
                await screen.findByText('Community Grant')
            ).toBeInTheDocument();

            expect(
                screen.getByText('Arts Fellowship')
            ).toBeInTheDocument();
        });

        it('reloads opportunities when the selected organization changes', async () => {
            const user = userEvent.setup();

            vi.mocked(getOpportunities).mockImplementation(
                async (organizationId: number) => {
                    return organizationId === 1
                        ? foundationOpportunities
                        : artsOpportunities;
                }
            );

            render(<DashboardPage />);

            await user.click(
                screen.getByRole('button', {
                    name: 'Formitable Foundation',
                })
            );

            expect(
                await screen.findByText('Community Grant')
            ).toBeInTheDocument();

            await user.click(
                screen.getByRole('button', {
                    name: 'Community Arts',
                })
            );

            expect(getOpportunities).toHaveBeenLastCalledWith(2);

            expect(
                await screen.findByText('Youth Arts Program')
            ).toBeInTheDocument();

            await waitFor(() => {
                expect(
                    screen.queryByText('Community Grant')
                ).not.toBeInTheDocument();
            });
        });
    });

    describe('deleting', () => {
        it('deletes an opportunity and keeps the others in the list', async () => {
            const user = userEvent.setup();

            vi.mocked(getOpportunities).mockResolvedValue(
                foundationOpportunities
            );
            vi.mocked(deleteOpportunity).mockResolvedValue(undefined);

            render(<DashboardPage />);

            // Select the organization to load its opportunities.
            await user.click(
                screen.getByRole('button', {
                    name: 'Formitable Foundation',
                })
            );

            // Wait for the opportunities to appear.
            expect(
                await screen.findByText('Community Grant')
            ).toBeInTheDocument();

            expect(
                screen.getByText('Arts Fellowship')
            ).toBeInTheDocument();

            // Delete Community Grant.
            await user.click(
                screen.getByRole('button', {
                    name: 'Delete Community Grant',
                })
            );

            // Verify the API received the correct organization and opportunity IDs.
            await waitFor(() => {
                expect(deleteOpportunity).toHaveBeenCalledWith(1, 101);
            });

            // Verify the deleted opportunity disappears.
            await waitFor(() => {
                expect(
                    screen.queryByText('Community Grant')
                ).not.toBeInTheDocument();
            });

            // Verify the other opportunity remains.
            expect(
                screen.getByText('Arts Fellowship')
            ).toBeInTheDocument();
        });
    });
});