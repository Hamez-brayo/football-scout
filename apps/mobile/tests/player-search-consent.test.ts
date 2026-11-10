import { beforeEach, expect, it, jest } from '@jest/globals';
import React, { type ComponentProps, type ReactElement, type ReactNode } from 'react';
let state: unknown[] = [];
let index = 0;
let effect: (() => void) | undefined;
const get = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const write = jest.fn<(...args: unknown[]) => Promise<unknown>>();
jest.mock('react', () => ({
  ...jest.requireActual<typeof import('react')>('react'),
  useEffect: (fn: () => void) => { effect = fn; },
  useState: (initial: unknown) => {
    const i = index++;
    if (!(i in state)) state[i] = initial;
    return [state[i], (value: unknown) => { state[i] = typeof value === 'function' ? value(state[i]) : value; }];
  },
}));
jest.mock('react-native', () => ({ View: 'View', Text: 'Text', TextInput: 'TextInput', Pressable: 'Pressable', StyleSheet: { create: (v: unknown) => v }, Linking: {} }));
jest.mock('../src/services/NetworkService', () => ({ NetworkService: { get: (...args: unknown[]) => get(...args), write: (...args: unknown[]) => write(...args) } }));
const { PlayerSearchConsent } = require('../src/screens/network/PlayerSearchConsent') as typeof import('../src/screens/network/PlayerSearchConsent');
const { Action, Copy } = require('../src/screens/network/NetworkUI') as typeof import('../src/screens/network/NetworkUI');
function render() { index = 0; return PlayerSearchConsent(); }
function elements<P>(node: ReactNode, type: unknown): ReactElement<P>[] {
  if (Array.isArray(node)) return node.flatMap(child => elements<P>(child, type));
  if (!React.isValidElement<{ children?: ReactNode }>(node)) return [];
  return [...(node.type === type ? [node as ReactElement<P>] : []), ...elements<P>(node.props.children, type)];
}
const actions = (node: ReactNode) => elements<ComponentProps<typeof Action>>(node, Action);
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
beforeEach(() => { state = []; index = 0; effect = undefined; jest.resetAllMocks(); });
it('loads opt-out setting and allows opting into player search', async () => {
  get.mockResolvedValue({ enabled: false }); write.mockResolvedValue({ enabled: true });
  render(); effect!(); await flush();
  expect(get).toHaveBeenCalledWith('/me/player-search');
  actions(render()).find(a => a.props.title === 'Appear in player search')!.props.onPress();
  expect(write).toHaveBeenCalledWith('patch', '/me/player-search', { enabled: true });
  await flush();
  expect(actions(render()).some(a => a.props.title === 'Stop appearing in player search')).toBe(true);
});
it('allows revoking consent and states scope of the setting', async () => {
  get.mockResolvedValue({ enabled: true }); write.mockResolvedValue({ enabled: false });
  render(); effect!(); await flush();
  expect(elements<ComponentProps<typeof Copy>>(render(), Copy).some(c => String(c.props.children).includes('direct links'))).toBe(true);
  actions(render()).find(a => a.props.title === 'Stop appearing in player search')!.props.onPress();
  expect(write).toHaveBeenCalledWith('patch', '/me/player-search', { enabled: false });
});
it('does not assume consent when loading fails', async () => {
  get.mockRejectedValue(new Error('offline'));
  render(); effect!(); await flush();
  expect(actions(render()).some(a => a.props.title === 'Appear in player search')).toBe(false);
  expect(actions(render()).some(a => a.props.title === 'Reload search setting')).toBe(true);
});

it('requires reloading after an ambiguous update failure', async () => {
  get.mockResolvedValue({ enabled: false }); write.mockRejectedValue(new Error('connection lost'));
  render(); effect!(); await flush();
  actions(render()).find(a => a.props.title === 'Appear in player search')!.props.onPress();
  await flush();
  const current = actions(render());
  expect(current.some(a => a.props.title === 'Appear in player search')).toBe(false);
  expect(current.some(a => a.props.title === 'Stop appearing in player search')).toBe(false);
  expect(current.some(a => a.props.title === 'Reload search setting')).toBe(true);
});
