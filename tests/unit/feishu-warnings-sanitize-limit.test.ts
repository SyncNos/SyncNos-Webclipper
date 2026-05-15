import { describe, expect, it, vi } from 'vitest';

import { bindFeishuDocxImagesByOrder } from '@services/sync/feishu/docx/image-block-binder';

const fetchFeishuJsonMock = vi.hoisted(() => vi.fn());
vi.mock('@services/sync/feishu/feishu-api', () => ({
  fetchFeishuJson: fetchFeishuJsonMock,
}));

const downloadImageSmartMock = vi.hoisted(() => vi.fn());
vi.mock('@platform/webext/image-download-proxy', () => ({
  downloadImageSmart: downloadImageSmartMock,
}));

const imageBindMocks = vi.hoisted(() => ({
  uploadImageToFeishu: vi.fn(async () => {
    throw new Error('upload failed: https://example.com/a.png?sig=SECRET');
  }),
  bindImageBlockWithFileToken: vi.fn(async () => undefined),
  guessFileNameFromUrl: vi.fn((_url: string, fallbackExt: string) => `image.${fallbackExt}`),
}));

vi.mock('@services/sync/feishu/docx/image-materializer', () => ({
  FEISHU_DOCX_IMAGE_MAX_BYTES: 20 * 1024 * 1024,
  uploadImageToFeishu: imageBindMocks.uploadImageToFeishu,
  bindImageBlockWithFileToken: imageBindMocks.bindImageBlockWithFileToken,
  guessFileNameFromUrl: imageBindMocks.guessFileNameFromUrl,
}));

describe('feishu warnings sanitization', () => {
  it('sanitizes query values in warnings (keeps only keys)', async () => {
    fetchFeishuJsonMock.mockResolvedValue({
      items: [{ block_id: 'img1', block_type: 27 }],
      has_more: false,
    });
    downloadImageSmartMock.mockResolvedValue({
      ok: true,
      reason: '',
      blob: new Blob([Uint8Array.from([1, 2, 3])], { type: 'image/png' }),
      contentType: 'image/png',
    });

    const res = await bindFeishuDocxImagesByOrder({
      accessToken: 't',
      docId: 'doc1',
      imageSourcesInOrder: [
        {
          kind: 'http',
          sourceUrl: 'https://example.com/a.png?sig=SECRET&x=1',
          urlForConvert: 'https://example.com/a.png?sig=SECRET&x=1',
        },
      ] as any,
    });

    const text = res.warnings.join('\n');
    expect(text).toContain('https://example.com/a.png?keys=sig,x');
    expect(text).not.toContain('SECRET');
  });
});

