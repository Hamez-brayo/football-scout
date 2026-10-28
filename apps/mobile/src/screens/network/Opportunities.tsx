import React, { useState } from 'react';
import { Linking } from 'react-native';
import {
  NetworkOpportunitySchema,
  type NetworkOpportunity,
  type NetworkOrganisation,
} from '@vysion/shared';
import { NetworkService as api } from '../../services/NetworkService';
import { Action, Card, Choices, Copy, Field, PagedList, Title, useMutation } from './NetworkUI';
import { canApply } from './logic';
export function Opportunities({ me }: { me: string }) {
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<NetworkOpportunity | null>(null);
  const [version, setVersion] = useState(0);
  if (creating)
    return (
      <>
        <Action title="Back to opportunities" onPress={() => setCreating(false)} />
        <OpportunityForm
          me={me}
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
        <Action title="Back to opportunities" onPress={() => setSelected(null)} />
        <OpportunityDetail
          opening={selected}
          me={me}
          onClose={() => {
            setSelected(null);
            setVersion((v) => v + 1);
          }}
        />
      </>
    );
  return (
    <>
      <Action title="Publish opportunity" onPress={() => setCreating(true)} />
      <PagedList<NetworkOpportunity>
        path="/opportunities"
        version={version}
        render={(o) => (
          <Card>
            <Title>{o.title}</Title>
            <Copy>
              {o.type.replace(/_/g, ' ')} · {o.location}
            </Copy>
            <Copy>
              {canApply(o) ? 'Open' : 'Closed or expired'} ·{' '}
              {o.organisation?.name || o.publisher?.fullName || 'Private publisher'}
            </Copy>
            <Action title="View opportunity" onPress={() => setSelected(o)} />
          </Card>
        )}
      />
    </>
  );
}
function OpportunityDetail({
  opening: o,
  me,
  onClose,
}: {
  opening: NetworkOpportunity;
  me: string;
  onClose: () => void;
}) {
  const m = useMutation();
  return (
    <Card>
      <Title>{o.title}</Title>
      <Copy>
        {o.type.replace(/_/g, ' ')} · {o.location}
      </Copy>
      <Copy>{o.description}</Copy>
      <Title>Requirements</Title>
      <Copy>{o.requirements}</Copy>
      <Copy>
        Expires {new Date(o.expiresAt).toLocaleString()} · {o.status}
      </Copy>
      <Action
        title={canApply(o) ? 'Apply on publisher website' : 'Applications unavailable'}
        disabled={!canApply(o) || m.busy}
        onPress={() => {
          void m.run(async () => {
            if (!canApply(o))
              throw new Error('This opening has expired or closed. Refresh the board.');
            await Linking.openURL(o.applicationUrl!);
          });
        }}
      />
      {(o.publisherId === me || o.organisation?.ownerId === me) && o.status !== 'CLOSED' && (
        <Action
          title="Close opportunity"
          disabled={m.busy}
          onPress={() => {
            void m.run(async () => {
              await api.write('patch', `/opportunities/${o.id}`, { status: 'CLOSED' });
              onClose();
            });
          }}
        />
      )}
      {m.status}
    </Card>
  );
}
function OpportunityForm({ onSaved, me }: { onSaved: () => void; me: string }) {
  const [form, setForm] = useState({
    title: '',
    type: 'TRIAL',
    description: '',
    requirements: '',
    location: '',
    applicationUrl: '',
    expiresAt: '',
    organisationId: '',
  });
  const m = useMutation();
  const field = (key: keyof typeof form, label: string, multiline = false) => (
    <Field
      label={label}
      value={form[key]}
      onChange={(v) => setForm((f) => ({ ...f, [key]: v }))}
      multiline={multiline}
    />
  );
  return (
    <Card>
      <Title>Publish opportunity</Title>
      {field('title', 'Title')}
      <Choices
        values={['TRIAL', 'PLAYER_RECRUITMENT', 'REPRESENTATION', 'FOOTBALL_JOB']}
        value={form.type}
        onChange={(v) => setForm((f) => ({ ...f, type: v }))}
      />
      {field('description', 'Description', true)}
      {field('requirements', 'Requirements', true)}
      {field('location', 'Location')}
      {field('applicationUrl', 'HTTPS application link')}
      {field('expiresAt', 'Expiry in UTC (2026-12-31T23:59:00Z)')}
      <Title>Publish as</Title>
      <Action
        title={form.organisationId ? 'Publish individually' : '✓ Individual profile'}
        onPress={() => setForm((f) => ({ ...f, organisationId: '' }))}
      />
      <Copy>Or choose a page you own. Browse pages below to find your organisation.</Copy>
      <PagedList<NetworkOrganisation>
        path="/organisations"
        render={(org) =>
          org.ownerId === me ? (
            <Action
              title={`${form.organisationId === org.id ? '✓ ' : ''}${org.name}`}
              onPress={() => setForm((f) => ({ ...f, organisationId: org.id }))}
            />
          ) : (
            <Copy>{org.name} · owned by another member</Copy>
          )
        }
      />
      {m.status}
      <Action
        title="Publish opportunity"
        disabled={m.busy}
        onPress={() => {
          void m.run(async () => {
            await api.write(
              'post',
              '/opportunities',
              NetworkOpportunitySchema.parse({
                ...form,
                ...(form.organisationId.trim()
                  ? { organisationId: form.organisationId.trim() }
                  : { organisationId: undefined }),
              }),
            );
            onSaved();
          });
        }}
      />
    </Card>
  );
}
