import { beforeEach, describe, expect, it, jest } from '@jest/globals';
const get = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const request = jest.fn<(...args: unknown[]) => Promise<unknown>>();
jest.mock('../src/api/client', () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => get(...args),
    request: (...args: unknown[]) => request(...args),
  },
}));
import { NetworkService } from '../src/services/NetworkService';
describe('authenticated network client contract', () => {
  beforeEach(() => {
    get.mockReset();
    request.mockReset();
  });
  it('unwraps bounded list envelopes and preserves search query', async () => {
    const data = { items: [], page: 2, limit: 20, hasMore: false };
    get.mockResolvedValue({ data: { data } });
    expect(await NetworkService.list('/profiles?search=coach', 2)).toEqual(data);
    expect(get).toHaveBeenCalledWith('/network/profiles?search=coach&page=2&limit=20');
  });
  it('sends exact membership payload through existing client', async () => {
    request.mockResolvedValue({ data: { data: { id: 'org' } } });
    await expect(
      NetworkService.write('patch', '/organisations/org/membership', { joined: false }),
    ).resolves.toEqual({ id: 'org' });
    expect(request).toHaveBeenCalledWith({
      method: 'patch',
      url: '/network/organisations/org/membership',
      data: { joined: false },
    });
  });
  it('propagates mutation failures for visible form errors', async () => {
    request.mockRejectedValue(new Error('Forbidden'));
    await expect(NetworkService.write('post', '/posts', { body: 'hello' })).rejects.toThrow(
      'Forbidden',
    );
  });
});
