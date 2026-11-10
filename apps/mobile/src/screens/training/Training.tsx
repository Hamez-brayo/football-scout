import React, { useEffect, useState } from 'react';
import { View, Linking } from 'react-native';
import api from '../../api/client';
import { Action, Card, Copy, Eyebrow, Field, Title, styles } from '../network/NetworkUI';
type Attempt = { id: string; drillId: string; videoUrl: string | null; notes: string | null; resultValue: number | null; resultUnit: string | null; isPublic: boolean; createdAt: string };
const drills = [
  { id: 'wall-passing', title: 'Wall passing', category: 'Passing', difficulty: 'Beginner', instructions: 'Pass against a wall and receive the return under control.', criteria: 'Count controlled passes in one minute.', equipment: 'Ball, wall and timer' },
  { id: 'close-control', title: 'Close control', category: 'Dribbling', difficulty: 'Beginner', instructions: 'Weave through markers using short touches. Turn and return.', criteria: 'Count controlled trips.', equipment: 'Ball and markers' },
  { id: 'first-touch', title: 'First touch', category: 'Control', difficulty: 'Intermediate', instructions: 'Pass against a wall and direct your first touch into space before passing again.', criteria: 'Count controlled first touches.', equipment: 'Ball, wall and markers' },
];
export function Training() {
  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState('All');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [video, setVideo] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState('');
  const [reload, setReload] = useState(0);
  const [historyError, setHistoryError] = useState(false);
  const chooseDrill = (id: string | null) => { setVideo(''); setNotes(''); setResult(''); setSelected(id); };
  const openVideo = async (url: string) => { try { await Linking.openURL(url); } catch { setError('Could not open video link.'); } };
  useEffect(() => {
    let active = true; setLoading(true); setError(''); setHistoryError(false);
    api.get<{ data: Attempt[] }>('/training/attempts').then(r => { if (active) setAttempts(r.data.data); })
      .catch(e => { if (active) { setAttempts([]); setError(e.message); setHistoryError(true); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reload]);
  const drill = drills.find(d => d.id === selected);
  const save = async () => {
    setBusy(true); setError('');
    try {
      if (result && (!Number.isFinite(Number(result)) || Number(result) < 0)) throw new Error('Enter a valid non-negative result.');
      await api.post('/training/attempts', { drillId: selected, ...(video.trim() ? { videoUrl: video.trim() } : {}), ...(notes.trim() ? { notes: notes.trim() } : {}), ...(result ? { resultValue: Number(result), resultUnit: 'repetitions' } : {}) });
      setVideo(''); setNotes(''); setResult(''); setReload(n => n + 1);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save attempt.'); } finally { setBusy(false); }
  };
  const visibility = async (a: Attempt) => {
    setBusy(true); setError('');
    try { await api.patch(`/training/attempts/${a.id}/visibility`, { isPublic: !a.isPublic }); setReload(n => n + 1); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not update visibility.'); } finally { setBusy(false); }
  };
  return <View style={{ gap: 12 }}>
    <Title>Training and progress</Title><Copy>Practice at your pace. Results are self-reported, not verified assessments.</Copy>
    {error ? <Card><Copy>{error}</Copy>{historyError && <Action title="Reload history" onPress={() => setReload(n => n + 1)} />}</Card> : null}
    {!drill ? <>
      <View style={styles.row}>{['All', 'Passing', 'Dribbling', 'Control'].map(c => <Action key={c} title={c === category ? `${c} ✓` : c} onPress={() => setCategory(c)} />)}</View>
      {drills.filter(d => category === 'All' || d.category === category).map(d => <Card key={d.id}><Eyebrow>{d.category} · {d.difficulty}</Eyebrow><Title>{d.title}</Title><Copy>{d.equipment}</Copy><Action title="View drill" onPress={() => chooseDrill(d.id)} /></Card>)}
    </> : <Card><Action title="Back to drills" onPress={() => chooseDrill(null)} /><Eyebrow>{drill.category} · {drill.difficulty}</Eyebrow><Title>{drill.title}</Title>
      <Copy>{drill.instructions}</Copy><Copy>Equipment: {drill.equipment}</Copy><Copy>Assessment: {drill.criteria} Keep your setup consistent.</Copy>
      <Field label="Video link (optional, HTTPS)" value={video} onChange={setVideo} /><Field label="Repetitions (optional)" value={result} onChange={setResult} /><Field label="Notes (optional)" value={notes} onChange={setNotes} multiline />
      <Copy>New attempts are private. Sharing makes your result and video link available to authenticated viewers when profile and media privacy allow. Your notes remain private. Anyone with the link may be able to view the video, and making an attempt private cannot revoke access at the video host.</Copy><Action title={busy ? 'Saving…' : 'Save private attempt'} disabled={busy} onPress={() => { void save(); }} />
    </Card>}
    <Title>Your attempts</Title>{loading ? <Copy>Loading your attempts…</Copy> : historyError ? <Copy>Attempt history could not be loaded.</Copy> : attempts.length === 0 ? <Copy>No attempts recorded yet.</Copy> : <Copy>Showing your latest {attempts.length} attempts (up to 100).</Copy>}
    {attempts.map(a => <Card key={a.id}><Title>{drills.find(d => d.id === a.drillId)?.title || a.drillId}</Title><Copy>{new Date(a.createdAt).toLocaleDateString()} · {a.isPublic ? 'Sharing enabled (subject to profile privacy)' : 'Private'}</Copy>
      {a.resultValue !== null && <Copy>Self-reported: {a.resultValue} {a.resultUnit || ''}</Copy>}{a.notes && <Copy>{a.notes}</Copy>}
      {a.videoUrl && <Action title="Open video" onPress={() => { if (a.videoUrl) void openVideo(a.videoUrl); }} />}
      <Action title={a.isPublic ? 'Make private' : 'Allow profile sharing'} disabled={busy} onPress={() => { void visibility(a); }} />
    </Card>)}
  </View>;
}

export function PublicEvidence({ id }: { id: string }) {
  const [items, setItems] = useState<Attempt[]>([]);
  const [status, setStatus] = useState('Loading shared evidence…');
  const [linkError, setLinkError] = useState('');
  useEffect(() => {
    let active = true;
    setItems([]);
    setStatus('Loading shared evidence…');
    api.get<{ data: Attempt[] }>(`/training/players/${encodeURIComponent(id)}/evidence`)
      .then(r => { if (active) { setItems(r.data.data); setStatus(''); } })
      .catch(() => { if (active) setStatus('Shared evidence is unavailable.'); });
    return () => { active = false; };
  }, [id]);
  const openVideo = async (url: string) => { setLinkError(''); try { await Linking.openURL(url); } catch { setLinkError('Could not open video link. Please try again.'); } };
  return <Card><Title>Shared training evidence</Title>{linkError ? <Copy>{linkError}</Copy> : null}{status ? <Copy>{status}</Copy> : items.length === 0 ? <Copy>No shared evidence yet.</Copy> : items.map(a => <View key={a.id} style={{gap: 6}}><Copy>{drills.find(d => d.id === a.drillId)?.title || a.drillId}{a.resultValue !== null ? ` · Self-reported: ${a.resultValue} ${a.resultUnit || ''}` : ''}</Copy>{a.videoUrl && <Action title="Open video" onPress={() => { if (a.videoUrl) void openVideo(a.videoUrl); }} />}</View>)}</Card>;
}
