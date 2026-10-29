import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Linking } from 'react-native';
import type { NetworkPage } from '@vysion/shared';
import { NetworkService as api } from '../../services/NetworkService';
export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: '#dbe5ef',
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#122b49' },
  text: { fontSize: 15, lineHeight: 23, color: '#334155' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  button: {
    backgroundColor: '#e8f1ff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 9,
  },
  buttonText: { color: '#1455a5', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#b5c7da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#122b49',
    backgroundColor: '#fff',
    minHeight: 46,
  },
});
export const Copy = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.text}>{children}</Text>
);
export const Title = ({ children }: { children: React.ReactNode }) => (
  <Text accessibilityRole="header" style={styles.title}>
    {children}
  </Text>
);
export const Card = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.card}>{children}</View>
);
export function Action({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && { opacity: 0.45 }]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChange,
  multiline = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  disabled?: boolean;
}) {
  return (
    <View style={{ gap: 5 }}>
      <Copy>{label}</Copy>
      <TextInput
        accessibilityLabel={label}
        value={value}
        editable={!disabled}
        accessibilityState={{ disabled }}
        onChangeText={disabled ? undefined : onChange}
        multiline={multiline}
        autoCapitalize="sentences"
        style={[styles.input, multiline && { minHeight: 90, textAlignVertical: 'top' }]}
      />
    </View>
  );
}
export function Choices({
  values,
  value,
  onChange,
  disabled = false,
}: {
  values: readonly string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.row}>
      {values.map((v) => (
        <Action
          key={v}
          title={`${v === value ? '✓ ' : ''}${v.replace(/_/g, ' ')}`}
          disabled={disabled}
          onPress={() => onChange(v)}
        />
      ))}
    </View>
  );
}
export function useMutation() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const run = async (work: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await work();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed. Try again.');
    } finally {
      setBusy(false);
    }
  };
  return {
    busy,
    run,
    error,
    status: (
      <>
        {busy && <Copy>Saving…</Copy>}
        {error && (
          <Text accessibilityRole="alert" style={{ color: '#b42318' }}>
            {error}
          </Text>
        )}
      </>
    ),
  };
}
export function ExternalLink({ url, label = 'Open link' }: { url: string; label?: string }) {
  const m = useMutation();
  return (
    <>
      <Action
        title={label}
        onPress={() => {
          void m.run(async () => {
            const parsed = new URL(url);
            if (parsed.protocol !== 'https:' || parsed.username || parsed.password)
              throw new Error('A safe HTTPS link is required.');
            await Linking.openURL(url);
          });
        }}
      />
      {m.status}
    </>
  );
}
export function PagedList<T extends { id: string }>({
  path,
  render,
  version = 0,
}: {
  path: string;
  render: (item: T) => React.ReactNode;
  version?: number;
}) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<NetworkPage<T> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    setPage(1);
  }, [path, version]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api
      .list<T>(path, page)
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [path, page, version, retry]);
  return (
    <View style={{ gap: 10 }}>
      {loading ? (
        <Copy>Loading…</Copy>
      ) : error ? (
        <>
          <Text accessibilityRole="alert">{error}</Text>
          <Action title="Retry" onPress={() => setRetry((x) => x + 1)} />
        </>
      ) : (
        <>
          {!data?.items.length && <Copy>No results yet.</Copy>}
          {data?.items.map((item) => (
            <View key={item.id}>{render(item)}</View>
          ))}
          <View style={styles.row}>
            <Action
              title="Previous page"
              disabled={page === 1}
              onPress={() => setPage((x) => x - 1)}
            />
            <Copy>Page {page}</Copy>
            <Action
              title="Next page"
              disabled={!data?.hasMore}
              onPress={() => setPage((x) => x + 1)}
            />
            <Action title="Refresh" onPress={() => setRetry((x) => x + 1)} />
          </View>
        </>
      )}
    </View>
  );
}
export function Detail<T>({
  path,
  children,
}: {
  path: string;
  children: (data: T, refresh: () => void) => React.ReactNode;
}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setData(null);
    setError('');
    api
      .get<T>(path)
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [path, version]);
  return data ? (
    <>{children(data, () => setVersion((v) => v + 1))}</>
  ) : error ? (
    <>
      <Copy>{error}</Copy>
      <Action title="Retry" onPress={() => setVersion((v) => v + 1)} />
    </>
  ) : (
    <Copy>Loading…</Copy>
  );
}
