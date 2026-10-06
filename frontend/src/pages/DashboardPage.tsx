import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../context/useAuth"
import { useState, useEffect } from 'react';

import OrganizationSelector from '../components/OrganizationSelector';
import { type Organization } from '../api/organizations';
import { type Opportunity, deleteOpportunity, getOpportunities } from '../api/opportunities';
import OpportunityList from "../components/OpportunityList";
import OpportunityForm from "../components/OpportunityForm";

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    if (!selectedOrganization) {
      return;
    }
    
    getOpportunities(selectedOrganization.id).then(setOpportunities);
  }, [selectedOrganization])

  function handleSelectOrganization(org: Organization) {
    setSelectedOrganization(org);
  }

  function handleAddOpportunity(newOpportunity: Opportunity) {
    setOpportunities(current => [...current, newOpportunity]);
  }

  function handleUpdateOpportunity(updatedOpportunity: Opportunity) {
    setOpportunities(current =>
      current.map(opportunity =>
        opportunity.id === updatedOpportunity.id
          ? updatedOpportunity
          : opportunity
      )
    );
  }

  async function handleDeleteOpportunity(deletedOpportunity: Opportunity) {
    await deleteOpportunity(selectedOrganization!.id, deletedOpportunity.id);

    setOpportunities(current =>
      current.filter(
        opportunity => opportunity.id !== deletedOpportunity.id
      )
    );
  }


  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}!</p>

      {selectedOrganization && 
        <p>Selected organization: {selectedOrganization.name}</p>
      }

      <OrganizationSelector handleSelectOrganization={handleSelectOrganization}/>

      <OpportunityList 
        selectedOrganization={selectedOrganization}
        opportunities={opportunities}
        onUpdate={handleUpdateOpportunity}
        onDelete={handleDeleteOpportunity}
      />

      {selectedOrganization &&
        <OpportunityForm 
          selectedOrganization={selectedOrganization}
          onAdd={handleAddOpportunity}
        />
      }

      <LogoutButton />
    </main>
  );
}