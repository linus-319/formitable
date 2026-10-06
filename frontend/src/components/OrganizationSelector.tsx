import { getOrganizations, type Organization } from '../api/organizations';
import { useState, useEffect } from 'react';

interface OrganizationSelectorProps {
    handleSelectOrganization: (org: Organization) => void,
}

export default function OrganizationSelector({ handleSelectOrganization }: OrganizationSelectorProps) {
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    useEffect(() => {
        getOrganizations().then(setOrganizations);
    }, []);

    return (
        <>
        {organizations.map((organization) => (
            <div onClick={() => handleSelectOrganization(organization)} key={organization.id}>
                <p>{organization.name}</p>
            </div>
        ))}
        </>
    )
}