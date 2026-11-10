import React, { useEffect, useState } from 'react';
import { NetworkService as api } from '../../services/NetworkService';
import { Action, Card, Copy, Title } from './NetworkUI';

type PlayerSearch = { enabled: boolean };

export function PlayerSearchConsent() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    setEnabled(null);
    setError('');
    api.get<PlayerSearch>('/me/player-search')
      .then(result => { if (active) setEnabled(result.enabled); })
      .catch(() => { if (active) setError('Could not load your search setting.'); });
    return () => { active = false; };
  }, [reload]);
  const update = async () => {
    if (enabled === null) return;
    setBusy(true);
    setError('');
    try {
      const result = await api.write<PlayerSearch>('patch', '/me/player-search', { enabled: !enabled });
      setEnabled(result.enabled);
    } catch {
      setEnabled(null);
      setError('Could not confirm your search setting. Reload it before making another change.');
    } finally {
      setBusy(false);
    }
  };
  return <Card>
    <Title>Player search</Title>
    <Copy>Choose whether your player profile can appear in player search. You can change this at any time.</Copy>
    <Copy>This setting only controls player search. Your profile may still be visible through direct links and elsewhere under your existing profile privacy settings.</Copy>
    {error ? <Copy>{error}</Copy> : null}
    {enabled === null ? error ? <Action title="Reload search setting" onPress={() => setReload(n => n + 1)} /> : <Copy>Loading search setting…</Copy> : <>
      <Copy>{enabled ? 'Your profile can appear in player search.' : 'Your profile is not included in player search.'}</Copy>
      <Action title={enabled ? 'Stop appearing in player search' : 'Appear in player search'} disabled={busy} onPress={() => { void update(); }} />
    </>}
  </Card>;
}
