import { extractDedaoNotesFromPage } from '@collectors/web/dedao-notes';

type DedaoNotesRequestPayload = {
  __syncnos: true;
  type: 'SYNCNOS_DEDAO_NOTES_REQUEST';
  requestId: string;
};

type DedaoNotesResponsePayload = {
  __syncnos: true;
  type: 'SYNCNOS_DEDAO_NOTES_RESPONSE';
  requestId: string;
  notes: Awaited<ReturnType<typeof extractDedaoNotesFromPage>>;
};

export default defineContentScript({
  matches: ['https://*.dedao.cn/*', 'https://dedao.cn/*', 'http://*.dedao.cn/*', 'http://dedao.cn/*'],
  world: 'MAIN',
  main() {
    window.addEventListener('message', async (event: MessageEvent) => {
      if (event.source !== window) return;
      const data: any = event.data;
      if (!data || data.__syncnos !== true) return;
      if (data.type !== 'SYNCNOS_DEDAO_NOTES_REQUEST') return;

      const requestId = String((data as DedaoNotesRequestPayload).requestId || '').trim();
      if (!requestId) return;

      let notes: Awaited<ReturnType<typeof extractDedaoNotesFromPage>> = [];
      try {
        notes = await extractDedaoNotesFromPage(document, location);
      } catch (_error) {
        notes = [];
      }

      try {
        window.postMessage(
          {
            __syncnos: true,
            type: 'SYNCNOS_DEDAO_NOTES_RESPONSE',
            requestId,
            notes,
          } satisfies DedaoNotesResponsePayload,
          '*',
        );
      } catch (_error) {
        // ignore
      }
    });
  },
});
