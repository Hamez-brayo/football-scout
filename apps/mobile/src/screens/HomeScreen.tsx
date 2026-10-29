import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Pressable, useWindowDimensions } from 'react-native';
import type { NetworkProfile } from '@vysion/shared';
import { useAuth } from '../contexts/AuthContext';
import { NetworkService as api } from '../services/NetworkService';
import {
  Action,
  Avatar,
  Eyebrow,
  palette,
  Card,
  Copy,
  Field,
  PagedList,
  Title,
  styles,
  useMutation,
} from './network/NetworkUI';
import { Feed } from './network/Feed';
import { ProfileDetail, ProfileEditor, ProfileView } from './network/Profile';
import { Organisations } from './network/Organisations';
import { Opportunities } from './network/Opportunities';
import { Messages } from './network/Messages';
type Section = 'Feed' | 'People' | 'Organisations' | 'Opportunities' | 'Messages' | 'Profile';
export default function HomeScreen() {
  const { logout } = useAuth();
  const { width } = useWindowDimensions();
  const wide = width >= 1000;
  const [section, setSection] = useState<Section>('Feed');
  const [profile, setProfile] = useState<string | null>(null);
  const [me, setMe] = useState<NetworkProfile | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const m = useMutation();
  useEffect(() => {
    let active = true;
    setError('');
    api
      .get<NetworkProfile>('/me')
      .then((p) => {
        if (active) setMe(p);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [retry]);
  const navigate = (next: Section) => {
    setProfile(null);
    setSection(next);
  };
  const openProfile = (id: string) => {
    setProfile(id);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.canvas }}>
      <View
        style={{
          backgroundColor: palette.navy,
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            maxWidth: 1100,
            width: '100%',
            alignSelf: 'center',
            flexWrap: 'wrap',
          }}
        >
          <View>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 27,
                fontWeight: '900',
                letterSpacing: 3,
              }}
            >
              VYSION<Text style={{ color: '#6DE2AA' }}>.</Text>
            </Text>
            <Text style={{ color: '#ADC7BD', fontSize: 11, letterSpacing: 1.2 }}>
              YOUR WORLD OF FOOTBALL
            </Text>
          </View>
          <View style={styles.row}>
            <Action title="My profile" onPress={() => navigate('Profile')} />
            <Action
              title="Sign out"
              disabled={m.busy}
              onPress={() => {
                void m.run(logout);
              }}
            />
          </View>
        </View>
        {m.status}
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          maxWidth: wide ? 1100 : 720,
          width: '100%',
          alignSelf: 'center',
          paddingBottom: 28,
        }}
      >
        <View style={{ gap: 8, paddingVertical: 10 }}>
          <Eyebrow>THE FOOTBALL NETWORK</Eyebrow>
          <Text
            accessibilityRole="header"
            style={{
              fontSize: wide ? 34 : 27,
              lineHeight: wide ? 42 : 34,
              fontWeight: '800',
              color: palette.navy,
            }}
          >
            {section === 'Feed'
              ? 'The game connects us.'
              : section === 'People'
                ? 'Find your next connection.'
                : section === 'Organisations'
                  ? 'Inside the football ecosystem.'
                  : section === 'Opportunities'
                    ? 'Make your next move.'
                    : section === 'Messages'
                      ? 'Keep the conversation going.'
                      : 'Your football story.'}
          </Text>
          <Copy>
            {section === 'Feed'
              ? 'Career moments, training and ideas from the football community.'
              : 'Build relationships. Share your experience. Create opportunities.'}
          </Copy>
          <View style={styles.row}>
            <Action title="Clubs & agencies" onPress={() => navigate('Organisations')} />
            {me && <Action title="View my public profile" onPress={() => openProfile(me.id)} />}
          </View>
        </View>
        {!me ? (
          error ? (
            <Card>
              <Copy>{error}</Copy>
              <Action title="Retry profile" onPress={() => setRetry((v) => v + 1)} />
            </Card>
          ) : (
            <Copy>Loading your network…</Copy>
          )
        ) : profile ? (
          <>
            <Action title={`Back to ${section}`} onPress={() => setProfile(null)} />
            <ProfileDetail key={profile} id={profile} me={me} />
          </>
        ) : (
          <View key={section} style={{ gap: 12 }}>
            {section === 'Feed' && <Feed me={me.id} onProfile={openProfile} />}
            {section === 'People' && <People onProfile={openProfile} />}
            {section === 'Organisations' && <Organisations me={me.id} onProfile={openProfile} />}
            {section === 'Opportunities' && <Opportunities me={me.id} />}
            {section === 'Messages' && <Messages me={me.id} />}
            {section === 'Profile' && (
              <>
                <Card>
                  <ProfileView profile={me} />
                </Card>
                <ProfileEditor
                  profile={me}
                  onSaved={(p) => {
                    setMe(p);
                    navigate('Feed');
                  }}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
      <View
        accessibilityLabel="Network sections"
        style={{
          flexDirection: 'row',
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderColor: palette.border,
          paddingVertical: 8,
          paddingHorizontal: 8,
        }}
      >
        {(
          [
            ['Feed', '◉', 'Feed'],
            ['People', '◎', 'Network'],
            ['Opportunities', '◇', 'Opportunities'],
            ['Messages', '▤', 'Messages'],
          ] as const
        ).map(([tab, icon, label]) => (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: section === tab && !profile }}
            onPress={() => navigate(tab)}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: 54,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 3,
              backgroundColor:
                section === tab ? palette.mint : pressed ? palette.canvas : '#FFFFFF',
            })}
          >
            <Text
              style={{
                color: section === tab ? palette.emerald : palette.muted,
                fontSize: 20,
              }}
            >
              {icon}
            </Text>
            <Text
              style={{
                color: section === tab ? '#086144' : palette.muted,
                fontSize: 11,
                fontWeight: '700',
              }}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
function People({ onProfile }: { onProfile: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  return (
    <>
      <Title>Find football professionals</Title>
      <Field label="Search people (name or headline)" value={search} onChange={setSearch} />
      <Action title="Search" onPress={() => setQuery(search.trim().slice(0, 120))} />
      <PagedList<NetworkProfile>
        path={`/profiles?search=${encodeURIComponent(query)}`}
        render={(p) => (
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar name={p.fullName || 'Member'} />
              <View style={{ flex: 1, gap: 4 }}>
                <Eyebrow>
                  {p.userType === 'TALENT' ? 'Player' : p.userType || 'Professional'}
                </Eyebrow>
                <Title>{p.fullName || 'Member'}</Title>
              </View>
            </View>
            <Copy>
              {p.userType} · {p.headline}
            </Copy>
            <Copy>
              {[p.currentLocation, p.position, p.currentClub].filter(Boolean).join(' · ') ||
                'Building their football profile'}
            </Copy>
            <Copy>Role and career details are self-declared.</Copy>
            <Action title="View profile" onPress={() => onProfile(p.id)} />
          </Card>
        )}
      />
    </>
  );
}
