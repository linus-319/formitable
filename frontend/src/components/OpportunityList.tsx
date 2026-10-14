import { type Organization } from '../api/organizations';
import { type Opportunity } from '../api/opportunities';
import OpportunityCard from './OpportunityCard'

interface OpportunityListProps {
    selectedOrganization: Organization | null,
    opportunities: Opportunity[],
    onUpdate: (opportunity: Opportunity) => void,
    onDelete: (opportunity: Opportunity) => void,
}

export default function OpportunityList({ selectedOrganization, opportunities, onUpdate, onDelete }: OpportunityListProps) {
    if (!selectedOrganization) {
        return <p>Select an organization to view its opportunities</p>
    }

    return (
        <div>
            <h2>Your org's opportunities</h2>
            <ul>
                {opportunities.map((opportunity) => 
                    <li key={opportunity.id} >
                        <OpportunityCard 
                            opportunity={opportunity} 
                            selectedOrganization={selectedOrganization}
                            onSave={onUpdate}
                            onRemove={onDelete}
                        />
                    </li>
                )}
            </ul>
        </div>
    )
}