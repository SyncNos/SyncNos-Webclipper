import { describe, expect, test } from 'vitest';

import { extractSelectionText, extractUserSelectionText, isSelectionLikelyWithinRoot } from '@services/shared/dom/selection';

describe('shared/dom/selection', () => {
  test('extractSelectionText: returns none for null selection', () => {
    expect(extractSelectionText(null)).toEqual({ text: '', method: 'none' });
  });

  test('extractSelectionText: prefers selection.toString()', () => {
    const selection = {
      rangeCount: 1,
      toString: () => '  hello  ',
      getRangeAt: () => ({
        toString: () => 'range',
        cloneContents: () => ({ textContent: 'clone' }),
      }),
    } as any;

    expect(extractSelectionText(selection, { trim: true })).toEqual({ text: 'hello', method: 'selection_toString' });
  });

  test('extractSelectionText: falls back to range.toString()', () => {
    const selection = {
      rangeCount: 1,
      toString: () => '   ',
      getRangeAt: () => ({
        toString: () => '  range  ',
        cloneContents: () => ({ textContent: 'clone' }),
      }),
    } as any;

    expect(extractSelectionText(selection, { trim: true })).toEqual({ text: 'range', method: 'range_toString' });
  });

  test('extractSelectionText: falls back to cloneContents().textContent', () => {
    const selection = {
      rangeCount: 1,
      toString: () => '',
      getRangeAt: () => ({
        toString: () => '',
        cloneContents: () => ({ textContent: '  cloned text  ' }),
      }),
    } as any;

    expect(extractSelectionText(selection, { trim: true })).toEqual({ text: 'cloned text', method: 'clone_textContent' });
  });

  test('extractSelectionText: respects maxLen', () => {
    const selection = {
      rangeCount: 1,
      toString: () => 'abcdefghij',
    } as any;

    expect(extractSelectionText(selection, { trim: true, maxLen: 4 })).toEqual({
      text: 'abcd',
      method: 'selection_toString',
    });
  });

  test('isSelectionLikelyWithinRoot: uses anchor/focus contains checks first', () => {
    const anchorNode = {};
    const selection = {
      anchorNode,
      focusNode: {},
      rangeCount: 1,
      getRangeAt: () => ({
        commonAncestorContainer: {},
      }),
    } as any;
    const root = {
      contains: (node: any) => node === anchorNode,
    } as any;

    expect(isSelectionLikelyWithinRoot(selection, root)).toBe(true);
  });

  test('isSelectionLikelyWithinRoot: falls back to range.commonAncestorContainer', () => {
    const ancestor = {};
    const selection = {
      anchorNode: null,
      focusNode: null,
      rangeCount: 1,
      getRangeAt: () => ({
        commonAncestorContainer: ancestor,
      }),
    } as any;
    const root = {
      contains: (node: any) => node === ancestor,
    } as any;

    expect(isSelectionLikelyWithinRoot(selection, root)).toBe(true);
  });

  test('extractUserSelectionText: falls back to active iframe selection', () => {
    const originalWindow = (globalThis as any).window;
    const originalDocument = (globalThis as any).document;
    try {
      const iframeSelection = {
        rangeCount: 1,
        toString: () => 'iframe text',
      };
      (globalThis as any).window = {
        getSelection: () => ({ rangeCount: 1, toString: () => '' }),
      };
      (globalThis as any).document = {
        activeElement: {
          tagName: 'iframe',
          contentWindow: { getSelection: () => iframeSelection },
        },
      };

      expect(extractUserSelectionText({ trim: true })).toEqual({ text: 'iframe text', method: 'selection_toString' });
    } finally {
      (globalThis as any).window = originalWindow;
      (globalThis as any).document = originalDocument;
    }
  });
});
