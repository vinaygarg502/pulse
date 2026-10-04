import { describe, it } from 'vitest';
import path from 'node:path';
import { Verifier } from '@pact-foundation/pact';

describe('Metrics API contract', () => {
  it('satisfies the Dashboard contract', async () => {
    const verifier = new Verifier({
      provider: 'PulseAPI',
      providerBaseUrl: 'http://localhost:3000',
      pactUrls: [path.resolve(process.cwd(), '../dashboard/pacts/PulseDashboard-PulseAPI.json')],
    });

    await verifier.verifyProvider();
  });
});
