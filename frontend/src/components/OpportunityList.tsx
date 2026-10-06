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
            <h1>Your org's opportunities</h1>
            {opportunities.map((opportunity) => 
                <OpportunityCard 
                    key={opportunity.id} 
                    opportunity={opportunity} 
                    selectedOrganization={selectedOrganization}
                    onSave={onUpdate}
                    onRemove={onDelete}
                />
            )}
        </div>
    )
}