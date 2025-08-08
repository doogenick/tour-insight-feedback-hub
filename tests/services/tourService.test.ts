import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach } from 'vitest';
import { tourService } from '../../src/services/api/tourService';
import { api, localforage } from '../../src/services/api/config';

describe('tourService', () => {
  let mock: MockAdapter;

  beforeEach(async () => {
    mock = new MockAdapter(api);
    await localforage.clear();
  });

  it('falls back to local data when API fails for upcoming tours', async () => {
    mock.onGet('/tours/upcoming').reply(500);

    await localforage.setItem('tour_1', { tour_id: '1', tour_code: 'TAD140525' } as any);

    const tours = await tourService.getUpcomingTours();
    expect(tours.length).toBe(1);
    expect(tours[0].tour_code).toBe('TAD140525');
  });

  it('can generate demo data', async () => {
    const { tours, clients, feedback } = await tourService.generateDemoData();
    expect(Array.isArray(tours)).toBe(true);
    expect(Array.isArray(clients)).toBe(true);
    expect(Array.isArray(feedback)).toBe(true);
  });
});
