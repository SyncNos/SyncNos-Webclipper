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
  uploadImageToFeishu: vi.fn(),
  bindImageBlockWithFileToken: vi.fn(async () => undefined),
  guessFileNameFromUrl: vi.fn((_url: string, fallbackExt: string) => `image.${fallbackExt}`),
}));

vi.mock('@services/sync/feishu/docx/image-materializer', () => ({
  FEISHU_DOCX_IMAGE_MAX_BYTES: 20 * 1024 * 1024,
  uploadImageToFeishu: imageBindMocks.uploadImageToFeishu,
  bindImageBlockWithFileToken: imageBindMocks.bindImageBlockWithFileToken,
  guessFileNameFromUrl: imageBindMocks.guessFileNameFromUrl,
}));

describe('feishu image bind retry', () => {
  it('retries upload on 429 then succeeds', async () => {
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

    let attempts = 0;
    imageBindMocks.uploadImageToFeishu.mockImplementation(async () => {
      attempts += 1;
      if (attempts < 3) {
        const err: any = new Error('rate limit');
        err.status = 429;
        throw err;
      }
      return 'file_tok';
    });

    const res = await bindFeishuDocxImagesByOrder({
      accessToken: 't',
      docId: 'doc1',
      imageSourcesInOrder: [
        { kind: 'http', sourceUrl: 'https://example.com/a.png', urlForConvert: 'https://example.com/a.png' } as any,
      ],
    });

    expect(imageBindMocks.uploadImageToFeishu).toHaveBeenCalledTimes(3);
    expect(res.boundCount).toBe(1);
  });
});
