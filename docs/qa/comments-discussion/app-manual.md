# App comments acceptance

## Scope

The App surface uses the same React discussion tree for wide and narrow layouts. The checks below cover selection attachment, root/reply mutations, active-thread focus, article context changes, exact locator behavior, and teardown.

## Automated evidence

| Area | Evidence | Result |
| --- | --- | --- |
| Wide geometry | `app-shell-comments-sidebar.test.ts` asserts `data-surface="app-wide"`, docked open/close, persisted collapsed state, and medium-tier list suppression | PASS |
| Narrow geometry | `conversations-scene-narrow-comments-flow.test.ts` asserts `data-surface="app-narrow"`, full-width layout, no resize handle, close and two-step Escape navigation | PASS |
| Selection attachment | App smoke creates a real DOM `Range`, commits on `selectionchange` + `pointerup`, preserves the quote while typing in root/reply composers, and rejects missing roots | PASS |
| Mutation flow | App smoke performs root save, keyboard thread activation, reply save, two-step destructive confirmation, and deletion | PASS |
| Context switch | App smoke keeps the sidebar mounted while switching article A to B and verifies both canonical URL and conversation-id reads | PASS |
| Exact multi-line locate | `comment-anchor-resolver-v2`, `comment-anchor-controller`, `range-scroll-controller`, and `comment-marker-registry` tests cover unique exact range resolution, nested-scroll geometry, active/passive marker replacement, ambiguity and unavailable roots | PASS |
| Failure states | Resolver tests require `ambiguous`, `not_found`, `budget_exceeded`, and cancelled generations to return without approximate scrolling | PASS |

## Chromium browser evidence

The extension build targets Chromium MV3 and the same bundle is used by Chrome and Edge. In this execution environment, automated tests run in JSDOM and the production Chromium build is validated separately; an interactive installed-extension session is not available, so no manual browser claim is fabricated.

Manual verification checklist for both Chrome and Edge:

1. Open an article in App wide mode and confirm the comments panel is a fixed right sidebar without covering article text.
2. Select text spanning multiple visual lines, release the pointer, and confirm the quote appears once.
3. Save a root comment, activate it with mouse and Enter, add a reply, then delete the reply with the two-step confirmation.
4. Click the saved quote and confirm the exact range is scrolled into view and receives the active marker.
5. Switch to another article while the panel remains open; confirm comments and markers switch identity without retaining the prior draft.
6. Resize to the narrow route and confirm the same controls, ordering, focus behavior, and Escape sequence.
7. Test a changed or duplicated quote and confirm a failure notice appears without approximate scrolling.

## Known test-infrastructure noise

Some React smoke tests emit existing `act(...)` and synchronous-unmount warnings. Assertions complete successfully; the warnings are tracked as test-harness debt rather than product behavior.
