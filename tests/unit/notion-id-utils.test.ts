import { describe, expect, it } from 'vitest';

import { normalizeNotionDatabaseIdInput } from '@services/sync/notion/notion-id-utils';

describe('notion-id-utils', () => {
  it('keeps 32-hex id as-is (lowercased)', () => {
    expect(normalizeNotionDatabaseIdInput('346be9d6386a81748c6af9b7db455770')).toBe('346be9d6386a81748c6af9b7db455770');
    expect(normalizeNotionDatabaseIdInput('346BE9D6386A81748C6AF9B7DB455770')).toBe('346be9d6386a81748c6af9b7db455770');
  });

  it('strips hyphens from UUID input', () => {
    expect(normalizeNotionDatabaseIdInput('346be9d6-386a-8174-8c6a-f9b7db455770')).toBe(
      '346be9d6386a81748c6af9b7db455770',
    );
  });

  it('extracts database id from full notion url (prefers pathname over v=)', () => {
    expect(
      normalizeNotionDatabaseIdInput(
        'https://app.notion.com/chiimagnus/346be9d6386a81748c6af9b7db455770?v=346be9d6386a81269331000cdd947d5e&source=copy_link',
      ),
    ).toBe('346be9d6386a81748c6af9b7db455770');
  });

  it('returns empty for non-id input', () => {
    expect(normalizeNotionDatabaseIdInput('')).toBe('');
    expect(normalizeNotionDatabaseIdInput('not an id')).toBe('');
    expect(normalizeNotionDatabaseIdInput('https://app.notion.com/')).toBe('');
  });
});
