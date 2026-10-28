import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { NetworkConnection, NetworkMessage, NetworkPage } from '@vysion/shared';
import { NetworkService as api } from '../../services/NetworkService';
import { Action, Card, Copy, Field, PagedList, Title, useMutation } from './NetworkUI';
import { readableMessages } from './logic';
export function Messages({ me }: { me: string }) {
  const [chat, setChat] = useState<NetworkConnection | null>(null);
  const [version, setVersion] = useState(0);
  if (chat)
    return (
      <>
        <Action title="Back to connections" onPress={() => setChat(null)} />
        <Chat key={chat.id} connection={chat} me={me} />
      </>
    );
  return (
    <>
      <Title>Connections & messages</Title>
      <Copy>Accept incoming requests to start a conversation. Messages refresh on demand.</Copy>
      <PagedList<NetworkConnection>
        path="/connections"
        version={version}
        render={(c) => (
          <ConnectionCard
            connection={c}
            me={me}
            open={() => setChat(c)}
            refresh={() => setVersion((v) => v + 1)}
          />
        )}
      />
    </>
  );
}
function ConnectionCard({
  connection: c,
  me,
  open,
  refresh,
}: {
  connection: NetworkConnection;
  me: string;
  open: () => void;
  refresh: () => void;
}) {
  const m = useMutation();
  const other = c.requesterId === me ? c.recipient : c.requester;
  return (
    <Card>
      <Title>{other?.fullName || 'Private profile'}</Title>
      <Copy>{other?.headline}</Copy>
      <Copy>
        {c.status}
        {c.status === 'PENDING'
          ? c.recipientId === me
            ? ' · Incoming request'
            : ' · Request sent'
          : ''}
      </Copy>
      {c.status === 'PENDING' && c.recipientId === me && (
        <>
          {['ACCEPTED', 'DECLINED'].map((status) => (
            <Action
              key={status}
              title={status === 'ACCEPTED' ? 'Accept' : 'Decline'}
              disabled={m.busy}
              onPress={() => {
                void m.run(async () => {
                  await api.write('patch', `/connections/${c.id}`, { status });
                  refresh();
                });
              }}
            />
          ))}
        </>
      )}
      {c.status === 'ACCEPTED' && <Action title="Open conversation" onPress={open} />}
      {m.status}
    </Card>
  );
}
function Chat({ connection: c, me }: { connection: NetworkConnection; me: string }) {
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState<NetworkPage<NetworkMessage> | null>(null);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const m = useMutation();
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api
      .list<NetworkMessage>(`/connections/${c.id}/messages`, page)
      .then((d) => {
        if (active) setHistory(d);
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
  }, [c.id, page, version]);
  const other = c.requesterId === me ? c.recipient : c.requester;
  return (
    <Card>
      <Title>{other?.fullName || 'Private profile'}</Title>
      <Copy>History page {page} · oldest to newest within this page</Copy>
      {loading ? (
        <Copy>Loading…</Copy>
      ) : error ? (
        <>
          <Copy>{error}</Copy>
          <Action title="Retry" onPress={() => setVersion((v) => v + 1)} />
        </>
      ) : (
        <>
          {!history?.items.length && <Copy>No messages yet. Start a conversation.</Copy>}
          {readableMessages(history?.items || []).map((message) => (
            <View
              key={message.id}
              style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: message.senderId === me ? '#e8f1ff' : '#f1f5f9',
              }}
            >
              <Copy>
                {message.senderId === me ? 'You' : other?.fullName || 'Member'} ·{' '}
                {new Date(message.createdAt).toLocaleString()}
              </Copy>
              <Copy>{message.body}</Copy>
            </View>
          ))}
        </>
      )}
      <Action
        title="Older messages"
        disabled={loading || !history?.hasMore}
        onPress={() => setPage((p) => p + 1)}
      />
      <Action
        title="Newer messages"
        disabled={loading || page === 1}
        onPress={() => setPage((p) => p - 1)}
      />
      <Action title="Refresh conversation" onPress={() => setVersion((v) => v + 1)} />
      <Field label="Message (up to 2000 characters)" value={body} onChange={setBody} multiline />
      {m.status}
      <Action
        title="Send message"
        disabled={m.busy || !body.trim()}
        onPress={() => {
          void m.run(async () => {
            if (body.trim().length > 2000)
              throw new Error('Messages can contain up to 2000 characters.');
            await api.write('post', `/connections/${c.id}/messages`, { body: body.trim() });
            setBody('');
            setPage(1);
            setVersion((v) => v + 1);
          });
        }}
      />
    </Card>
  );
}
