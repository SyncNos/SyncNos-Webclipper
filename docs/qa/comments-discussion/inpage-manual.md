# Inpage comments acceptance

## Scope

The Inpage surface mounts the shared React discussion tree in an open extension shadow root and docks it to the current top-level page. This acceptance record covers SPA URL changes, page geometry, exact multi-line selection, root changes, frame boundaries, shadow-DOM limits, and teardown behavior.

## Automated evidence

| Area | Evidence | Result |
| --- | --- | --- |
| SPA route changes | `inpage-comments-sidebar-toggle.test.ts` changes `history.pushState`, reopens the panel, and requires the same single host while `readPageUrl()` returns the current URL | PASS |
| Dock and resize | The smoke test opens at desktop width, switches below and above the 768 px dock breakpoint, closes, and reopens; the document dock attribute must be removed and restored correctly | PASS |
| Multi-line selection | The smoke test creates a real DOM `Range` containing a newline and requires a V2 `dom-text-v2` locator with the complete canonical quote | PASS |
| Top-frame boundary | `createInpageCommentsDomSource().isTopFrame()` is required to reject a frame where `top !== self` | PASS |
| Root restoration | `inpage-comment-root-source.test.ts` requires document-relative root restoration first, evidence validation, panel-selection rejection, no body fallback, and a bounded candidate list | PASS |
| Structure changes | Root evidence and exact resolver tests require changed content, missing roots, ambiguity, budget exhaustion, and cancellation to fail without approximate scrolling | PASS |
| Marker teardown | `comment-anchor-controller.test.ts` requires generation guards, independent passive sync, stale completion rejection, idempotent reset/dispose, and registry cleanup | PASS |

## Chromium browser checklist

The production bundle targets Chromium MV3 and is shared by Chrome and Edge. This execution environment validates JSDOM behavior and the production build but does not provide an interactive installed-extension browser, so manual results are not fabricated.

Run the following checklist in both Chrome and Edge:

1. Open comments on a regular article page at desktop width. Confirm the page is docked once and the panel does not cover the selected text.
2. Navigate through an SPA route without a full reload. Reopen comments and confirm there is still one panel, the new canonical URL is used, and the prior route's markers are gone.
3. Resize below and above the dock breakpoint. Confirm narrow mode stops padding the host page and desktop mode restores the dock width without horizontal overflow.
4. Select text spanning multiple rendered lines, save a root comment, and click its quote. Confirm exact Range scrolling and active/passive marker hierarchy.
5. Change or duplicate the selected article text. Confirm the panel reports an unavailable or ambiguous location and does not scroll approximately.
6. Close and reopen the panel. Confirm dock styles and panel-scoped markers are removed while closed and rebuilt on reopen.
7. Navigate away or reload. Confirm no marker overlay or dock attribute survives the document lifecycle.

## Frame and shadow-DOM boundaries

- The panel is top-frame only. Child-frame executions return before opening a duplicate panel.
- A selection inside an iframe belongs to that frame's document and is not captured by the top document. Cross-frame anchoring is not supported.
- The extension panel itself uses an **open** shadow root so its own controls remain testable and accessible, but page content roots are discovered from the page document.
- Document queries and document-relative paths do not pierce page shadow roots. Content inside a closed shadow root is unsupported; content inside an open page shadow root may be visible to page code but is not guaranteed to be recoverable by the current root-candidate strategy.
- These limits are reported as missing/unavailable roots. The implementation must not use `document.body`, sleep-based retries, or approximate text scrolling to make them appear supported.

## Teardown contract

- Closing the panel clears the page dock attribute and all exact markers.
- Context changes reset marker generations before new roots are resolved.
- Session/controller dispose is idempotent and aborts late work.
- The hidden panel host may be reused within the same document for stable SPA behavior; a new document receives a new host and registry.
