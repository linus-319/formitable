import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createOpportunity, updateOpportunity, type Opportunity } from '../api/opportunities';
import type { Organization } from '../api/organizations';
import OpportunityForm from './OpportunityForm';

vi.mock('../api/opportunities', () => ({
    createOpportunity: vi.fn(),
    updateOpportunity: vi.fn(),
}));

describe('OpportunityForm', () => {
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

    const existingOpportunity: Opportunity = {
        id: 101,
        organization: 1,
        name: 'Community Grant',
        description: 'Funding for community projects',
        status: 'open',
        deadline: '2026-12-31',
        created_at: '2026-10-14T12:00:00Z',
        updated_at: '2026-10-14T12:00:00Z',
    };

    const updatedOpportunity: Opportunity = {
        ...existingOpportunity,
        name: 'Updated Community Grant',
        description: 'Funding for local community projects',
        status: 'closed',
        deadline: '2027-01-31',
        updated_at: '2026-10-15T12:00:00Z',
    };

    beforeEach(() => {
        vi.mocked(createOpportunity).mockReset();
        vi.mocked(updateOpportunity).mockReset();
    });

    describe('creation', () => {
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

    describe('editing', () => {
        it('populates the form with the existing opportunity data', () => {
            render(
                <OpportunityForm
                    selectedOrganization={organization}
                    opportunity={existingOpportunity}
                />
            );

            expect(screen.getByRole('textbox', { name: 'Name' }))
                .toHaveValue('Community Grant');

            expect(screen.getByRole('textbox', { name: 'Description' }))
                .toHaveValue('Funding for community projects');

            expect(screen.getByRole('combobox', { name: 'Status' }))
                .toHaveValue('open');

            expect(screen.getByLabelText('Deadline'))
                .toHaveValue('2026-12-31');

            expect(screen.getByRole('button', { name: 'Update opportunity' }))
                .toBeInTheDocument();
        });

        it('submits the updated values to the API', async () => {
            const user = userEvent.setup();

            vi.mocked(updateOpportunity).mockResolvedValue(updatedOpportunity);

            render(
                <OpportunityForm
                    selectedOrganization={organization}
                    opportunity={existingOpportunity}
                />
            );

            const nameInput = screen.getByRole('textbox', { name: 'Name' });
            await user.clear(nameInput);
            await user.type(nameInput, 'Updated Community Grant');

            const descriptionInput = screen.getByRole('textbox', { name: 'Description' });
            await user.clear(descriptionInput);
            await user.type(descriptionInput, 'Funding for local community projects');

            await user.selectOptions(
                screen.getByRole('combobox', { name: 'Status' }),
                'closed'
            );

            await user.clear(screen.getByLabelText('Deadline'));
            await user.type(screen.getByLabelText('Deadline'), '2027-01-31');

            await user.click(screen.getByRole('button', { name: 'Update opportunity' }));

            await waitFor(() => {
                expect(updateOpportunity).toHaveBeenCalledWith(1, 101, {
                    name: 'Updated Community Grant',
                    description: 'Funding for local community projects',
                    status: 'closed',
                    deadline: '2027-01-31',
                });
            });
        });

        it('calls onSave with the opportunity returned by the API', async () => {
            const user = userEvent.setup();
            const onSave = vi.fn();

            vi.mocked(updateOpportunity).mockResolvedValue(updatedOpportunity);

            render(
                <OpportunityForm
                    selectedOrganization={organization}
                    opportunity={existingOpportunity}
                    onSave={onSave}
                />
            );

            const nameInput = screen.getByRole('textbox', { name: 'Name' });
            await user.clear(nameInput);
            await user.type(nameInput, 'Updated Community Grant');

            await user.click(screen.getByRole('button', { name: 'Update opportunity' }));

            await waitFor(() => {
                expect(onSave).toHaveBeenCalledTimes(1);
                expect(onSave).toHaveBeenCalledWith(updatedOpportunity);
            });
        });
    });
});