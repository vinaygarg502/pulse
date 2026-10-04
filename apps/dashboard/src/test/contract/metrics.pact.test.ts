import { describe, expect, it } from 'vitest';
import { PactV4, Matchers } from '@pact-foundation/pact';
import { getMetricsData } from '@/services/metrics';
import { config } from '@/config/env';

const { like } = Matchers;

describe('Metrics API contract', () => {
  it('returns metrics expected by the dashboard', async () => {
    const pact = new PactV4({
      consumer: 'PulseDashboard',
      provider: 'PulseAPI',
    });

    await pact
      .addInteraction()
      .given('metrics are available')
      .uponReceiving('a request for metrics')
      .withRequest('GET', '/metrics')
      .willRespondWith(200, (builder) => {
        builder.headers({
          'Content-Type': 'application/json',
        });

        builder.jsonBody({
          data: {
            totalEvents: like(10),
          },
        });
      })
      .executeTest(async (mockServer) => {
        const originalApiUrl = config.API_URL;

        config.API_URL = mockServer.url;

        try {
          const controller = new AbortController();

          const metrics = await getMetricsData(controller.signal);

          expect(metrics.totalEvents).toEqual(expect.any(Number));
        } finally {
          config.API_URL = originalApiUrl;
        }
      });
  });
});
