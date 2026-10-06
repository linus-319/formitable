import { type Organization } from '../api/organizations';
import { type Opportunity } from '../api/opportunities';
import { useState } from 'react';
import { createOpportunity, updateOpportunity } from '../api/opportunities'

interface OpportunityFormProps {
    selectedOrganization: Organization,
    opportunity?: Opportunity,
    onSave?: (opportunity: Opportunity) => void,
    onAdd?: (opportunity: Opportunity) => void,
}

export default function OpportunityForm({ selectedOrganization, opportunity, onSave, onAdd } : OpportunityFormProps) {
    const [name, setName] = useState(opportunity?.name ?? "");
    const [description, setDescription] = useState(opportunity?.description ?? "");
    const [status, setStatus] = useState<'open' | 'closed'>(opportunity?.status ?? 'open');
    const [deadline, setDeadline] = useState(opportunity?.deadline ?? "");

    async function handleSubmitOpportunity(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (opportunity) {
            const updatedOpportunity = await updateOpportunity(
                selectedOrganization.id,
                opportunity.id,
                {
                    name,
                    description,
                    status,
                    deadline: deadline || null,
                }
            );

            onSave?.(updatedOpportunity);
        } else {
            const newOpportunity = await createOpportunity(
                selectedOrganization.id,
                {
                    name,
                    description,
                    status,
                    deadline: deadline || null,
                }
            );

            onAdd?.(newOpportunity)

            setName("");
            setDescription("");
            setStatus("open");
            setDeadline("");
        }
    }

    return (
        <form onSubmit={handleSubmitOpportunity}>
            <h1>{opportunity ? 'Edit opportunity' : 'Create opportunity'}</h1>

            <label htmlFor='name'>Name</label>
            <input 
                id='name'
                type='text' 
                name='name'
                value={name}
                required
                onChange={(e) => { setName(e.target.value) }}
            />

            <label htmlFor='description'>Description</label>
            <textarea 
                id='description'
                name='description'
                value={description}
                onChange={(e) => { setDescription(e.target.value) }}
            >
            </textarea>

            <label htmlFor='status'>Status</label>
            <select 
                name="status" 
                id="status" 
                value={status} 
                onChange={(e) => { setStatus(e.target.value as 'open' | 'closed') }}
            >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
            </select>

            <label htmlFor='deadline'>Deadline</label>
            <input 
                id='deadline'
                name='deadline'
                type='date' 
                value={deadline}
                onChange={(e) => { setDeadline(e.target.value) }}
            />

            <button type='submit'>
                {opportunity ? 'Update opportunity' : 'Create opportunity'}
            </button>
        </form>
    )
}