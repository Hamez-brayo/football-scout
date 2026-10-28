import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import type { NetworkProfile } from '@vysion/shared';
import { useAuth } from '../contexts/AuthContext';
import { NetworkService as api } from '../services/NetworkService';
import {
  Action,
  Card,
  Copy,
  Field,
  PagedList,
  Title,
  styles,
  useMutation,
} from './network/NetworkUI';
import { Feed } from './network/Feed';
import { ProfileDetail, ProfileEditor } from './network/Profile';
import { Organisations } from './network/Organisations';
import { Opportunities } from './network/Opportunities';
import { Messages } from './network/Messages';
type Section = 'Feed' | 'People' | 'Organisations' | 'Opportunities' | 'Messages' | 'Profile';
export default function HomeScreen() {
  const { logout } = useAuth();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f7fc' }}>
      <View
        style={{
          padding: 16,
          gap: 10,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderColor: '#dbe5ef',
        }}
      >
        <Title>VYSION · Football network</Title>
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
        {m.status}
        <ScrollView
          horizontal
          contentContainerStyle={{ gap: 8 }}
          accessibilityLabel="Network sections"
        >
          {(['Feed', 'People', 'Organisations', 'Opportunities', 'Messages'] as const).map(
            (tab) => (
              <Action
                key={tab}
                title={`${section === tab ? '● ' : ''}${tab}`}
                onPress={() => navigate(tab)}
              />
            ),
          )}
        </ScrollView>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          maxWidth: 850,
          width: '100%',
          alignSelf: 'center',
          paddingBottom: 60,
        }}
      >
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
              <ProfileEditor
                profile={me}
                onSaved={(p) => {
                  setMe(p);
                  navigate('Feed');
                }}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
function People({ onProfile }: { onProfile: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  return (
    <>
      <Title>Find football professionals</Title>
      <Field
        label="Search people (name, headline or expertise)"
        value={search}
        onChange={setSearch}
      />
      <Action title="Search" onPress={() => setQuery(search.trim().slice(0, 120))} />
      <PagedList<NetworkProfile>
        path={`/profiles?search=${encodeURIComponent(query)}`}
        render={(p) => (
          <Card>
            <Title>{p.fullName || 'Member'}</Title>
            <Copy>
              {p.userType} · {p.headline}
            </Copy>
            <Copy>{p.currentLocation}</Copy>
            <Action title="View profile" onPress={() => onProfile(p.id)} />
          </Card>
        )}
      />
    </>
  );
}
