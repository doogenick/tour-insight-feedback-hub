import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import feedbackService from '../../src/services/api/feedbackService';
import { api, localforage } from '../../src/services/api/config';

const setOnline = (online: boolean) => {
  Object.defineProperty(window.navigator, 'onLine', {
    value: online,
    configurable: true,
  });
};

describe('feedbackService', () => {
  let mock: MockAdapter;

  beforeEach(async () => {
    mock = new MockAdapter(api);
    await localforage.clear();
  });

  afterEach(() => {
    mock.reset();
    setOnline(true);
  });

  it('stores feedback locally when offline', async () => {
    setOnline(false);

    const res = await feedbackService.submitFeedback({
      tour_id: 'TOUR-1',
      client_name: 'John Doe',
      ratings: { overall: 5 },
    } as any);

    expect(res.success).toBe(true);
    expect(res.message.toLowerCase()).toContain('offline');

    const stored = await localforage.getItem(`feedback_${res.data?.id}`);
    expect(stored).toBeTruthy();
  });

  it('syncs pending feedback when back online', async () => {
    setOnline(true);

    // Mock backend endpoint
    mock.onPost('/feedback/create').reply(200, { ok: true });

    // Seed one pending item locally
    const pending = {
      id: 'TEST-1',
      tour_id: 'TOUR-2',
      client_name: 'Jane',
      ratings: { overall: 4 },
      status: 'Pending',
      submitted_at: new Date().toISOString(),
    } as any;
    await localforage.setItem(`feedback_${pending.id}`, pending);

    const result = await feedbackService.syncPendingFeedback();
    expect(result.synced).toBe(1);

    const updated = await localforage.getItem<any>('feedback_TEST-1');
    expect(updated.status).toBe('Synced');
  });
});
