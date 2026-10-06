import { type Opportunity } from '../api/opportunities'
import { useState } from 'react'
import OpportunityForm from './OpportunityForm'
import { type Organization } from '../api/organizations'

interface OpportunityCardProps {
    opportunity: Opportunity,
    selectedOrganization: Organization,
    onSave: (opportunity: Opportunity) => void,
    onRemove: (opportunity: Opportunity) => void,
}

export default function OpportunityCard({ opportunity, selectedOrganization, onSave, onRemove } : OpportunityCardProps) {
    const [editing, setEditing] = useState(false)

    if (editing) {
        return (
            <div>
                <OpportunityForm
                    opportunity={opportunity}
                    selectedOrganization={selectedOrganization}
                    onSave={(updatedOpportunity) => {
                        onSave(updatedOpportunity);
                        setEditing(false);
                    }}
                />
                <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
        )
    }

    return (
        <div>
            <h3>Name: {opportunity.name}</h3>
            <p>Description: {opportunity.description}</p>
            <p>Status: {opportunity.status}</p>
            <p>Deadline: {opportunity.deadline}</p>
            
            <button onClick={() => setEditing(true)}>Edit Opportunity</button>
            <button onClick={() => onRemove(opportunity)}>Delete Opportunity</button>
        </div>
    )
}