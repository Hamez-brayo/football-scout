import { beforeEach, expect, it, jest } from '@jest/globals';
import React, { type ComponentProps, type ReactElement, type ReactNode } from 'react';
let state: unknown[] = [];
let index = 0;
const post = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const patch = jest.fn<(...args: unknown[]) => Promise<unknown>>();
jest.mock('react', () => ({
  ...jest.requireActual<typeof import('react')>('react'),
  useEffect: () => undefined,
  useState: (initial: unknown) => {
    const i = index++;
    if (!(i in state)) state[i] = initial;
    return [state[i], (value: unknown) => { state[i] = typeof value === 'function' ? value(state[i]) : value; }];
  },
}));
jest.mock('react-native', () => ({ View: 'View', Text: 'Text', TextInput: 'TextInput', Pressable: 'Pressable', StyleSheet: { create: (v: unknown) => v }, Linking: {} }));
jest.mock('../src/api/client', () => ({ __esModule: true, default: { post: (...args: unknown[]) => post(...args), patch: (...args: unknown[]) => patch(...args) } }));
const { Training } = require('../src/screens/training/Training') as typeof import('../src/screens/training/Training');
const { Action, Field, Title } = require('../src/screens/network/NetworkUI') as typeof import('../src/screens/network/NetworkUI');
function render() { index = 0; return Training(); }
function elements<P>(node: ReactNode, type: unknown): ReactElement<P>[] {
  if (Array.isArray(node)) return node.flatMap(child => elements<P>(child, type));
  if (!React.isValidElement<{ children?: ReactNode }>(node)) return [];
  return [...(node.type === type ? [node as ReactElement<P>] : []), ...elements<P>(node.props.children, type)];
}
const actions = (node: ReactNode) => elements<ComponentProps<typeof Action>>(node, Action);
const fields = (node: ReactNode) => elements<ComponentProps<typeof Field>>(node, Field);
beforeEach(() => { state = []; index = 0; jest.resetAllMocks(); });
it('filters drills by category', () => {
  actions(render()).find(a => a.props.title === 'Passing')!.props.onPress();
  const titles = elements<ComponentProps<typeof Title>>(render(), Title).map(x => x.props.children);
  expect(titles).toContain('Wall passing');
  expect(titles).not.toContain('Close control');
});
it('submits a private attempt with self-reported measurements', async () => {
  post.mockResolvedValue({});
  actions(render()).find(a => a.props.title === 'View drill')!.props.onPress();
  fields(render()).find(f => f.props.label.startsWith('Video'))!.props.onChange('https://example.com/video');
  fields(render()).find(f => f.props.label.startsWith('Repetitions'))!.props.onChange('12');
  actions(render()).find(a => a.props.title === 'Save private attempt')!.props.onPress();
  expect(post).toHaveBeenCalledWith('/training/attempts', { drillId: 'wall-passing', videoUrl: 'https://example.com/video', resultValue: 12, resultUnit: 'repetitions' });
});
it('enables sharing only for the selected attempt', () => {
  state[2] = [{ id: 'a', drillId: 'wall-passing', videoUrl: null, notes: null, resultValue: null, resultUnit: null, isPublic: false, createdAt: '2026-01-01T00:00:00Z' }];
  patch.mockResolvedValue({});
  actions(render()).find(a => a.props.title === 'Allow profile sharing')!.props.onPress();
  expect(patch).toHaveBeenCalledWith('/training/attempts/a/visibility', { isPublic: true });
});
it('clears a draft when changing drills', () => {
  actions(render()).find(a => a.props.title === 'View drill')!.props.onPress();
  fields(render()).find(f => f.props.label.startsWith('Video'))!.props.onChange('https://example.com/old');
  actions(render()).find(a => a.props.title === 'Back to drills')!.props.onPress();
  actions(render()).filter(a => a.props.title === 'View drill')[1].props.onPress();
  expect(fields(render()).find(f => f.props.label.startsWith('Video'))!.props.value).toBe('');
});
