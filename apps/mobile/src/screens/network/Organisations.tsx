import React, { useState } from 'react';
import { NetworkOrganisationSchema, type NetworkOrganisation } from '@vysion/shared';
import { NetworkService as api } from '../../services/NetworkService';
import { Opportunities } from './Opportunities';
import {
  Action,
  Card,
  Choices,
  Copy,
  Detail,
  ExternalLink,
  Field,
  PagedList,
  Title,
  useMutation,
} from './NetworkUI';
export function Organisations({ me, onProfile }: { me: string; onProfile: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [version, setVersion] = useState(0);
  if (creating)
    return (
      <>
        <Action title="Back to organisations" onPress={() => setCreating(false)} />
        <OrganisationForm
          onSaved={() => {
            setCreating(false);
            setVersion((v) => v + 1);
          }}
        />
      </>
    );
  if (selected)
    return (
      <>
        <Action title="Back to organisations" onPress={() => setSelected(null)} />
        <Detail<NetworkOrganisation> path={`/organisations/${selected}`}>
          {(org, refresh) => (
            <OrganisationDetail
              key={org.id}
              org={org}
              me={me}
              refresh={refresh}
              onProfile={onProfile}
            />
          )}
        </Detail>
      </>
    );
  return (
    <>
      <Action title="Create organisation" onPress={() => setCreating(true)} />
      <PagedList<NetworkOrganisation>
        path="/organisations"
        version={version}
        render={(o) => (
          <Card>
            <Title>{o.name}</Title>
            <Copy>
              {o.type} · {o.location}
            </Copy>
            <Copy>{o.description}</Copy>
            <Action title="View organisation" onPress={() => setSelected(o.id)} />
          </Card>
        )}
      />
    </>
  );
}
function OrganisationDetail({
  org: initialOrg,
  me,
  refresh,
  onProfile,
}: {
  org: NetworkOrganisation;
  me: string;
  refresh: () => void;
  onProfile: (id: string) => void;
}) {
  const [org, setOrg] = useState(initialOrg);
  const [edit, setEdit] = useState(false);
  const m = useMutation();
  const [joined, setJoined] = useState(org.members.some((p) => p.id === me));
  if (edit)
    return (
      <>
        <Action title="Cancel edit" onPress={() => setEdit(false)} />
        <OrganisationForm
          org={org}
          onSaved={() => {
            setEdit(false);
            refresh();
          }}
        />
      </>
    );
  return (
    <Card>
      <Title>{org.name}</Title>
      <Copy>
        {org.type} · {org.location}
      </Copy>
      <Copy>{org.description}</Copy>
      <Copy>
        Owner: {org.owner?.fullName || 'Private profile'}. Ownership is not verified affiliation.
      </Copy>
      {org.website && <ExternalLink url={org.website} label="Website" />}
      <Title>Members</Title>
      {org.members.length ? (
        org.members.map((p) => (
          <Action key={p.id} title={p.fullName || 'Member'} onPress={() => onProfile(p.id)} />
        ))
      ) : (
        <Copy>No visible members.</Copy>
      )}
      <Copy>Shows up to 50 visible members. Use join/leave to set your membership.</Copy>
      <Action
        title="Join organisation"
        disabled={m.busy}
        onPress={() => {
          void m.run(async () => {
            setOrg(
              await api.write<NetworkOrganisation>('patch', `/organisations/${org.id}/membership`, {
                joined: true,
              }),
            );
            setJoined(true);
          });
        }}
      />
      <Action
        title="Leave organisation"
        disabled={m.busy}
        onPress={() => {
          void m.run(async () => {
            setOrg(
              await api.write<NetworkOrganisation>('patch', `/organisations/${org.id}/membership`, {
                joined: false,
              }),
            );
            setJoined(false);
          });
        }}
      />
      <Copy>{joined ? 'Your membership is joined.' : 'You can join this page.'}</Copy>
      {org.ownerId === me && <Action title="Edit organisation" onPress={() => setEdit(true)} />}
      {m.status}
      <Title>Opportunities</Title>
      <Opportunities key={org.id} me={me} organisationId={org.id} />
    </Card>
  );
}
function OrganisationForm({ org, onSaved }: { org?: NetworkOrganisation; onSaved: () => void }) {
  const [name, setName] = useState(org?.name || '');
  const [type, setType] = useState(org?.type || 'CLUB');
  const [description, setDescription] = useState(org?.description || '');
  const [location, setLocation] = useState(org?.location || '');
  const [website, setWebsite] = useState(org?.website || '');
  const m = useMutation();
  return (
    <Card>
      <Title>{org ? 'Edit organisation' : 'Create organisation'}</Title>
      <Field disabled={m.busy} label="Name" value={name} onChange={setName} />
      <Choices disabled={m.busy} values={['CLUB', 'AGENCY']} value={type} onChange={setType} />
      <Field
        disabled={m.busy}
        label="Description"
        value={description}
        onChange={setDescription}
        multiline
      />
      <Field disabled={m.busy} label="Location" value={location} onChange={setLocation} />
      <Field disabled={m.busy} label="HTTPS website" value={website} onChange={setWebsite} />
      {m.status}
      <Action
        title="Save organisation"
        disabled={m.busy}
        onPress={() => {
          void m.run(async () => {
            await api.write(
              org ? 'patch' : 'post',
              org ? `/organisations/${org.id}` : '/organisations',
              NetworkOrganisationSchema.parse({
                name,
                type,
                description: description || null,
                location: location || null,
                website: website || null,
              }),
            );
            onSaved();
          });
        }}
      />
    </Card>
  );
}
