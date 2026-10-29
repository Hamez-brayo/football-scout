import { beforeEach, expect, it, jest } from '@jest/globals';
import React, { type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { ExperienceLevel, type NetworkOrganisation, type NetworkProfile } from '@vysion/shared';

// A small hook harness exercises real component handlers without a native/device renderer.
let state: unknown[] = [];
let stateIndex = 0;
const write = jest.fn<(...args: unknown[]) => Promise<unknown>>();
jest.mock('react', () => ({
  ...jest.requireActual<typeof import('react')>('react'),
  useState: (initial: unknown) => {
    const index = stateIndex++;
    if (!(index in state)) state[index] = initial;
    return [
      state[index],
      (value: unknown) => {
        state[index] = typeof value === 'function' ? value(state[index]) : value;
      },
    ];
  },
}));
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  Pressable: 'Pressable',
  StyleSheet: { create: (value: unknown) => value },
  Linking: {},
}));
jest.mock('../src/services/NetworkService', () => ({
  NetworkService: {
    write: (...args: unknown[]) => write(...args),
  },
}));
import { ProfileEditor, ProfileView } from '../src/screens/network/Profile';
import { Feed } from '../src/screens/network/Feed';
import { Organisations } from '../src/screens/network/Organisations';
import { Opportunities } from '../src/screens/network/Opportunities';
import { Action, Choices, Copy, Detail, Field, PagedList } from '../src/screens/network/NetworkUI';

function render(component: () => ReactNode) {
  stateIndex = 0;
  return component();
}
function elements<P>(node: ReactNode, type: unknown): ReactElement<P>[] {
  if (Array.isArray(node)) return node.flatMap((child) => elements<P>(child, type));
  if (!React.isValidElement<{ children?: ReactNode }>(node)) return [];
  return [
    ...(node.type === type ? [node as ReactElement<P>] : []),
    ...elements<P>(node.props.children, type),
  ];
}
const fields = (node: ReactNode) => elements<ComponentProps<typeof Field>>(node, Field);
const actions = (node: ReactNode) => elements<ComponentProps<typeof Action>>(node, Action);
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};
const me: NetworkProfile = {
  id: 'me',
  firstName: 'Ada',
  lastName: null,
  fullName: 'Ada',
  userType: 'TALENT',
  headline: null,
  biography: null,
  expertise: [],
  currentLocation: null,
  position: null,
  currentClub: null,
  profilePhoto: null,
  videos: [],
  footballProfile: null,
};
const org: NetworkOrganisation = {
  id: 'club',
  name: 'Club',
  type: 'CLUB',
  description: null,
  location: null,
  website: null,
  ownerId: 'other',
  owner: null,
  members: [],
  createdAt: '2026-01-01T00:00:00Z',
};
function organisationDetail() {
  const screen = () => Organisations({ me: me.id, onProfile: jest.fn() });
  const list = elements<ComponentProps<typeof PagedList<NetworkOrganisation>>>(
    render(screen),
    PagedList,
  )[0];
  actions(list.props.render(org))
    .find((a) => a.props.title === 'View organisation')!
    .props.onPress();
  const detail = elements<ComponentProps<typeof Detail<NetworkOrganisation>>>(
    render(screen),
    Detail,
  )[0];
  const child = detail.props.children(org, jest.fn()) as ReactElement<Record<string, unknown>>;
  const component = child.type as (props: Record<string, unknown>) => ReactNode;
  state = [];
  return () => render(() => component(child.props));
}
beforeEach(() => {
  state = [];
  stateIndex = 0;
  jest.resetAllMocks();
});

it('disallows post edits during a deferred save and retains the submitted draft on failure', async () => {
  let reject!: (reason: Error) => void;
  write.mockImplementationOnce(
    () =>
      new Promise((_resolve, fail) => {
        reject = fail;
      }),
  );
  const screen = () => render(() => Feed({ me: 'me', onProfile: jest.fn() }));
  fields(screen())[0].props.onChange('Draft A');
  actions(screen())
    .find((a) => a.props.title === 'Publish post')!
    .props.onPress();
  const pending = screen();
  for (const field of fields(pending)) {
    const native = Field(field.props);
    const input = elements<{ editable?: boolean; onChangeText?: unknown }>(native, 'TextInput')[0];
    expect(input.props.editable).toBe(false);
    expect(input.props.onChangeText).toBeUndefined();
  }
  const choice = elements<ComponentProps<typeof Choices>>(pending, Choices)[0];
  expect(actions(Choices(choice.props)).every((a) => a.props.disabled)).toBe(true);
  reject(new Error('Offline'));
  await flush();
  const failed = screen();
  expect(fields(failed)[0].props.value).toBe('Draft A');
  expect(
    elements<{ editable?: boolean }>(Field(fields(failed)[0].props), 'TextInput')[0].props.editable,
  ).toBe(true);
});

it('consumes join and leave responses so displayed membership profiles change immediately', async () => {
  const screen = organisationDetail();
  write.mockResolvedValueOnce({ ...org, members: [me] });
  actions(screen())
    .find((a) => a.props.title === 'Join organisation')!
    .props.onPress();
  await flush();
  expect(actions(screen()).some((a) => a.props.title === 'Ada')).toBe(true);
  // Both explicit controls remain available even with a capped membership projection.
  expect(actions(screen()).some((a) => a.props.title === 'Leave organisation')).toBe(true);
  write.mockResolvedValueOnce(org);
  actions(screen())
    .find((a) => a.props.title === 'Leave organisation')!
    .props.onPress();
  await flush();
  expect(actions(screen()).some((a) => a.props.title === 'Ada')).toBe(false);
  expect(actions(screen()).some((a) => a.props.title === 'Join organisation')).toBe(true);
});

it('shows organisation-scoped opportunities without exposing a raw organisation ID', () => {
  const tree = organisationDetail()();
  const opportunities = elements<{ organisationId?: string }>(tree, Opportunities);
  expect(opportunities[0]?.props.organisationId).toBe('club');
  const copy = elements<ComponentProps<typeof Copy>>(tree, Copy);
  expect(JSON.stringify(copy.map((c) => c.props.children))).not.toContain('Organisation ID:');
});

it('sends organisation scope to the paginated opportunity endpoint', () => {
  const props = { me: 'me', organisationId: 'club with spaces' };
  const tree = render(() => Opportunities(props));
  const list = elements<ComponentProps<typeof PagedList>>(tree, PagedList)[0];
  expect(list.props.path).toBe('/opportunities?organisationId=club%20with%20spaces');
});

it('displays existing football experience and saves an explicit cleared value', async () => {
  const player = {
    ...me,
    firstName: 'Ada',
    lastName: 'Smith',
    footballProfile: {
      primaryPosition: null,
      currentClub: null,
      previousClubs: [],
      achievements: [],
      experience: ExperienceLevel.PRO,
    },
  };
  const view = elements<ComponentProps<typeof Copy>>(ProfileView({ profile: player }), Copy);
  expect(JSON.stringify(view.map((c) => c.props.children))).toContain('PRO');
  const screen = () => render(() => ProfileEditor({ profile: player, onSaved: jest.fn() }));
  const experience = elements<ComponentProps<typeof Choices>>(screen(), Choices).find((c) =>
    c.props.values.includes('PRO'),
  );
  expect(experience?.props.value).toBe('PRO');
  experience!.props.onChange('NOT_SPECIFIED');
  write.mockResolvedValueOnce(player);
  actions(screen())
    .find((a) => a.props.title === 'Save profile')!
    .props.onPress();
  await flush();
  expect(write).toHaveBeenCalledWith(
    'patch',
    '/me',
    expect.objectContaining({
      football: expect.objectContaining({ experience: null }),
    }),
  );
});
