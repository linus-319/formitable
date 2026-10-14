import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createOpportunity, type Opportunity } from '../api/opportunities';
import type { Organization } from '../api/organizations';
import OpportunityForm from './OpportunityForm';

vi.mock('../api/opportunities', () => ({
    createOpportunity: vi.fn(),
    updateOpportunity: vi.fn(),
}));

describe('OpportunityForm creation', () => {
    const organization: Organization = {
        id: 1,
        name: 'Formitable Foundation',
    };

    const createdOpportunity: Opportunity = {
        id: 101,
        organization: 1,
        name: 'Community Grant',
        description: 'Funding for community projects',
        status: 'open',
        deadline: '2026-12-31',
        created_at: '2026-10-14T12:00:00Z',
        updated_at: '2026-10-14T12:00:00Z',
    };

    beforeEach(() => {
        vi.mocked(createOpportunity).mockReset();
    });

    it('submits the form with the entered values', async () => {
        const user = userEvent.setup();

        vi.mocked(createOpportunity).mockResolvedValue(
            createdOpportunity
        );

        render(
            <OpportunityForm selectedOrganization={organization} />
        );

        await user.type(
            screen.getByRole('textbox', { name: 'Name' }),
            'Community Grant'
        );

        await user.type(
            screen.getByRole('textbox', { name: 'Description' }),
            'Funding for community projects'
        );

        await user.selectOptions(
            screen.getByRole('combobox', { name: 'Status' }),
            'open'
        );

        await user.type(
            screen.getByLabelText('Deadline'),
            '2026-12-31'
        );

        await user.click(
            screen.getByRole('button', { name: 'Create opportunity' })
        );

        await waitFor(() => {
            expect(createOpportunity).toHaveBeenCalledWith(1, {
                name: 'Community Grant',
                description: 'Funding for community projects',
                status: 'open',
                deadline: '2026-12-31',
            });
        });
    });

    it('calls onAdd with the opportunity returned by the API', async () => {
        const user = userEvent.setup();
        const onAdd = vi.fn();

        vi.mocked(createOpportunity).mockResolvedValue(
            createdOpportunity
        );

        render(
            <OpportunityForm
                selectedOrganization={organization}
                onAdd={onAdd}
            />
        );

        await user.type(
            screen.getByRole('textbox', { name: 'Name' }),
            'Community Grant'
        );

        await user.click(
            screen.getByRole('button', { name: 'Create opportunity' })
        );

        await waitFor(() => {
            expect(onAdd).toHaveBeenCalledTimes(1);
            expect(onAdd).toHaveBeenCalledWith(createdOpportunity);
        });
    });

    it('clears the form after successfully creating an opportunity', async () => {
        const user = userEvent.setup();

        vi.mocked(createOpportunity).mockResolvedValue(
            createdOpportunity
        );

        render(
            <OpportunityForm selectedOrganization={organization} />
        );

        const nameInput = screen.getByRole('textbox', { name: 'Name' });
        const descriptionInput = screen.getByRole('textbox', { name: 'Description' });
        const statusSelect = screen.getByRole('combobox', { name: 'Status' });
        const deadlineInput = screen.getByLabelText('Deadline');

        await user.type(nameInput, 'Community Grant');
        await user.type(descriptionInput, 'Funding for community projects');
        await user.selectOptions(statusSelect, 'closed');
        await user.type(deadlineInput, '2026-12-31');

        await user.click(
            screen.getByRole('button', { name: 'Create opportunity' })
        );

        await waitFor(() => {
            expect(nameInput).toHaveValue('');
        });

        expect(descriptionInput).toHaveValue('');
        expect(statusSelect).toHaveValue('open');
        expect(deadlineInput).toHaveValue('');
    });

    it('submits a null deadline when no deadline is entered', async () => {
        const user = userEvent.setup();

        vi.mocked(createOpportunity).mockResolvedValue({
            ...createdOpportunity,
            deadline: null,
        });

        render(
            <OpportunityForm selectedOrganization={organization} />
        );

        await user.type(
            screen.getByRole('textbox', { name: 'Name' }),
            'Community Grant'
        );

        await user.click(
            screen.getByRole('button', { name: 'Create opportunity' })
        );

        await waitFor(() => {
            expect(createOpportunity).toHaveBeenCalledWith(1, {
                name: 'Community Grant',
                description: '',
                status: 'open',
                deadline: null,
            });
        });
    });

    it('does not submit when the required name is empty', async () => {
        const user = userEvent.setup();

        render(
            <OpportunityForm selectedOrganization={organization} />
        );

        await user.click(
            screen.getByRole('button', { name: 'Create opportunity' })
        );

        expect(createOpportunity).not.toHaveBeenCalled();
    });
});