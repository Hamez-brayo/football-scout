import React, { useState } from 'react';
import { ExperienceLevel, NetworkProfileSchema, type NetworkProfile } from '@vysion/shared';
import { NetworkService as api } from '../../services/NetworkService';
import {
  Action,
  Card,
  Choices,
  Copy,
  Detail,
  ExternalLink,
  Field,
  Title,
  useMutation,
} from './NetworkUI';
import { lines } from './logic';
export function ProfileView({ profile: p }: { profile: NetworkProfile | null }) {
  if (!p) return <Copy>Private profile</Copy>;
  return (
    <>
      <Title>{p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Member'}</Title>
      <Copy>
        {p.userType} · {p.headline || 'Football professional'}
      </Copy>
      <Copy>{p.biography}</Copy>
      <Copy>{[p.currentLocation, p.position, p.currentClub].filter(Boolean).join(' · ')}</Copy>
      <Copy>{p.expertise.join(' · ')}</Copy>
      {p.footballProfile && (
        <>
          <Copy>
            Football: {p.footballProfile.primaryPosition} · {p.footballProfile.currentClub}
          </Copy>
          <Copy>
            Experience: {p.footballProfile.experience?.replace(/_/g, ' ') || 'Not listed'}
          </Copy>
          <Copy>Previous clubs: {p.footballProfile.previousClubs.join(', ') || 'None listed'}</Copy>
          {p.footballProfile.achievements.map((a) => (
            <Copy key={a.id}>
              {a.title}
              {a.description ? ` — ${a.description}` : ''}
            </Copy>
          ))}
        </>
      )}
      {p.videos.map((url, i) => (
        <ExternalLink key={url} url={url} label={`Watch video ${i + 1}`} />
      ))}
    </>
  );
}
export function ProfileDetail({ id, me }: { id: string; me: NetworkProfile }) {
  const m = useMutation();
  const [sent, setSent] = useState(false);
  return (
    <Detail<NetworkProfile> path={`/profiles/${id}`}>
      {(p) => (
        <Card>
          <ProfileView profile={p} />
          {id !== me.id && (
            <Action
              title={sent ? 'Request sent' : 'Connect'}
              disabled={m.busy || sent}
              onPress={() => {
                void m.run(async () => {
                  await api.write('post', '/connections', { recipientId: id });
                  setSent(true);
                });
              }}
            />
          )}
          {m.status}
        </Card>
      )}
    </Detail>
  );
}
export function ProfileEditor({
  profile: p,
  onSaved,
}: {
  profile: NetworkProfile;
  onSaved: (p: NetworkProfile) => void;
}) {
  const [form, setForm] = useState({
    firstName: p.firstName || '',
    lastName: p.lastName || '',
    userType: p.userType || 'TALENT',
    headline: p.headline || '',
    biography: p.biography || '',
    expertise: p.expertise.join('\n'),
    currentLocation: p.currentLocation || '',
    position: p.position || '',
    currentClub: p.currentClub || '',
    primaryPosition: p.footballProfile?.primaryPosition || '',
    footballClub: p.footballProfile?.currentClub || '',
    experience: p.footballProfile?.experience || 'NOT_SPECIFIED',
    previousClubs: p.footballProfile?.previousClubs.join('\n') || '',
    achievements:
      p.footballProfile?.achievements
        .map((a) => `${a.title}${a.description ? ` | ${a.description}` : ''}`)
        .join('\n') || '',
    videos: p.videos.join('\n'),
  });
  const m = useMutation();
  const field = (key: keyof typeof form, label: string, multiline = false) => (
    <Field
      disabled={m.busy}
      label={label}
      value={form[key]}
      onChange={(value) => setForm((f) => ({ ...f, [key]: value }))}
      multiline={multiline}
    />
  );
  return (
    <Card>
      <Title>Your professional profile</Title>
      <Copy>
        One entry per line for expertise, clubs, achievements and HTTPS videos. Achievements: title
        | description.
      </Copy>
      {field('firstName', 'First name')}
      {field('lastName', 'Last name')}
      <Choices
        disabled={m.busy}
        values={['TALENT', 'SCOUT', 'COACH', 'AGENT', 'CLUB']}
        value={form.userType}
        onChange={(value) => setForm((f) => ({ ...f, userType: value }))}
      />
      {field('headline', 'Headline')}
      {field('biography', 'Biography', true)}
      {field('expertise', 'Expertise', true)}
      {field('currentLocation', 'Location')}
      {field('position', 'Position')}
      {field('currentClub', 'Current club')}
      {field('primaryPosition', 'Football primary position')}
      {field('footballClub', 'Football club')}
      <Copy>Experience</Copy>
      <Choices
        disabled={m.busy}
        values={['NOT_SPECIFIED', ...Object.values(ExperienceLevel)]}
        value={form.experience}
        onChange={(value) => setForm((f) => ({ ...f, experience: value }))}
      />
      {field('previousClubs', 'Previous clubs', true)}
      {field('achievements', 'Achievements', true)}
      {field('videos', 'HTTPS footage links', true)}
      {m.status}
      <Action
        title="Save profile"
        disabled={m.busy}
        onPress={() => {
          void m.run(async () => {
            const payload = NetworkProfileSchema.parse({
              firstName: form.firstName,
              lastName: form.lastName,
              userType: form.userType,
              headline: form.headline || null,
              biography: form.biography || null,
              expertise: lines(form.expertise),
              currentLocation: form.currentLocation || null,
              position: form.position || null,
              currentClub: form.currentClub || null,
              videos: lines(form.videos),
              football: {
                experience: form.experience === 'NOT_SPECIFIED' ? null : form.experience,
                ...(form.primaryPosition ? { primaryPosition: form.primaryPosition } : {}),
                ...(form.footballClub ? { currentClub: form.footballClub } : {}),
                previousClubs: lines(form.previousClubs),
                achievements: lines(form.achievements).map((line) => {
                  const [title, ...rest] = line.split('|');
                  return {
                    title: title.trim(),
                    ...(rest.join('|').trim() ? { description: rest.join('|').trim() } : {}),
                  };
                }),
              },
            });
            onSaved(await api.write<NetworkProfile>('patch', '/me', payload));
          });
        }}
      />
    </Card>
  );
}
