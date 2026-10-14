import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getOrganizations, type Organization } from '../api/organizations';
import OrganizationSelector from './OrganizationSelector';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

vi.mock('../api/organizations', () => ({
    getOrganizations: vi.fn(),
}));

describe('OrganizationSelector', () => {
    beforeEach(() => {
        vi.mocked(getOrganizations).mockReset();
    });

    it('displays organizations returned by the API', async () => {
        const organizations: Organization[] = [
            { id: 1, name: 'Formitable Foundation' },
            { id: 2, name: 'Community Arts' },
        ];

        vi.mocked(getOrganizations).mockResolvedValue(organizations);

        render(
            <OrganizationSelector handleSelectOrganization={() => {}} />
        );

        expect(
            await screen.findByText('Formitable Foundation')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Community Arts')
        ).toBeInTheDocument();
    });

    it('calls the selection callback with the clicked organization', async () => {
        const user = userEvent.setup();

        const organizations: Organization[] = [
            { id: 1, name: 'Formitable Foundation' },
            { id: 2, name: 'Community Arts' },
        ];

        const handleSelectOrganization = vi.fn();

        vi.mocked(getOrganizations).mockResolvedValue(organizations);

        render(
            <OrganizationSelector
                handleSelectOrganization={handleSelectOrganization}
            />
        );

        // Wait for the organizations to appear
        const organization = await screen.findByText('Community Arts');

        // Simulate a real user clicking one
        await user.click(organization);

        // Verify the correct object was passed to the callback
        expect(handleSelectOrganization).toHaveBeenCalledTimes(1);
        expect(handleSelectOrganization).toHaveBeenCalledWith({
            id: 2,
            name: 'Community Arts',
        });
    });

    it('fetches organizations once when mounted, even after rerendering', async () => {
        const organizations: Organization[] = [
            { id: 1, name: 'Formitable Foundation' },
        ];

        vi.mocked(getOrganizations).mockResolvedValue(organizations);

        const { rerender } = render(
            <OrganizationSelector handleSelectOrganization={() => {}} />
        );

        // Wait for the initial API request
        await screen.findByText('Formitable Foundation');

        // Render the component again with the same props
        rerender(
            <OrganizationSelector handleSelectOrganization={() => {}} />
        );

        await waitFor(() => {
            expect(getOrganizations).toHaveBeenCalledTimes(1);
        });
    });

    it('renders no organizations when the API returns an empty list', async () => {
        vi.mocked(getOrganizations).mockResolvedValue([]);

        const { container } = render(
            <OrganizationSelector handleSelectOrganization={() => {}} />
        );

        // Wait until the API request has completed
        await waitFor(() => {
            expect(getOrganizations).toHaveBeenCalledTimes(1);
        });

        expect(container).toBeEmptyDOMElement();
    });
});