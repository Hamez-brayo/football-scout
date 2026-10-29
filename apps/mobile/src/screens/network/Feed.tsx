import React, { useState } from 'react';
import { NetworkPostSchema, type NetworkPost } from '@vysion/shared';
import { NetworkService as api } from '../../services/NetworkService';
import {
  Action,
  Card,
  Choices,
  Copy,
  ExternalLink,
  Field,
  PagedList,
  Title,
  useMutation,
} from './NetworkUI';
export function Feed({ me, onProfile }: { me: string; onProfile: (id: string) => void }) {
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('TEAM_UPDATE');
  const [media, setMedia] = useState('');
  const [version, setVersion] = useState(0);
  const m = useMutation();
  return (
    <>
      <Card>
        <Title>Share with football</Title>
        <Field disabled={m.busy} label="Post" value={body} onChange={setBody} multiline />
        <Choices
          disabled={m.busy}
          values={['MATCH_FOOTAGE', 'TRAINING', 'ACHIEVEMENT', 'TEAM_UPDATE', 'RECRUITMENT']}
          value={category}
          onChange={setCategory}
        />
        <Field
          disabled={m.busy}
          label="Optional HTTPS media link"
          value={media}
          onChange={setMedia}
        />
        {m.status}
        <Action
          title="Publish post"
          disabled={m.busy}
          onPress={() => {
            void m.run(async () => {
              await api.write(
                'post',
                '/posts',
                NetworkPostSchema.parse({
                  body,
                  category,
                  ...(media.trim() ? { mediaUrl: media.trim() } : {}),
                }),
              );
              setBody('');
              setMedia('');
              setVersion((v) => v + 1);
            });
          }}
        />
      </Card>
      <PagedList<NetworkPost>
        path="/posts"
        version={version}
        render={(post) => (
          <PostCard
            post={post}
            me={me}
            onProfile={onProfile}
            refresh={() => setVersion((v) => v + 1)}
          />
        )}
      />
    </>
  );
}
function PostCard({
  post,
  me,
  onProfile,
  refresh,
}: {
  post: NetworkPost;
  me: string;
  onProfile: (id: string) => void;
  refresh: () => void;
}) {
  const m = useMutation();
  return (
    <Card>
      <Action
        title={post.author?.fullName || 'Private profile'}
        disabled={!post.author}
        onPress={() => onProfile(post.authorId)}
      />
      <Copy>
        {post.category.replace(/_/g, ' ')} · {new Date(post.createdAt).toLocaleString()}
      </Copy>
      <Copy>{post.body}</Copy>
      {post.mediaUrl && <ExternalLink url={post.mediaUrl} label="View media" />}
      {post.authorId === me && (
        <Action
          title="Delete my post"
          disabled={m.busy}
          onPress={() => {
            void m.run(async () => {
              await api.write('delete', `/posts/${post.id}`);
              refresh();
            });
          }}
        />
      )}
      {m.status}
    </Card>
  );
}
