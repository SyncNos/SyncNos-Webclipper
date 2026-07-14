const DOCK_STYLE_ID = 'webclipper-inpage-comments-panel__dock-style';
const DOCK_ROOT_ATTR = 'data-webclipper-comments-dock';
const DOCK_WIDTH_CSS_VAR = '--webclipper-comments-dock-width';
const FLOATING_PANEL_BREAKPOINT_PX = 768;

export type DockController = {
  readWidthPx: () => number;
  syncWidth: () => void;
  setOpen: (open: boolean) => void;
  cleanup: () => void;
};

type CreateDockControllerOptions = {
  enabled: boolean;
  panelEl: HTMLElement;
};

function readViewportWidthPx(): number {
  return Number(globalThis.innerWidth || document.documentElement?.clientWidth || 0) || 0;
}

function shouldDockViewport(): boolean {
  return readViewportWidthPx() >= FLOATING_PANEL_BREAKPOINT_PX;
}

export function createDockController(options: CreateDockControllerOptions): DockController {
  const enabled = options.enabled === true;
  const panelEl = options.panelEl;
  let dockRaf: number | null = null;
  let listening = false;
  let open = false;
  let disposed = false;

  function ensureDockStyle() {
    if (!enabled || disposed) return;
    try {
      if (document.getElementById(DOCK_STYLE_ID)) return;
      const style = document.createElement('style');
      style.id = DOCK_STYLE_ID;
      style.textContent = [
        `html[${DOCK_ROOT_ATTR}='1'] {`,
        '  box-sizing: border-box !important;',
        `  padding-right: var(${DOCK_WIDTH_CSS_VAR}, 0px) !important;`,
        '  overflow-x: hidden !important;',
        '}',
        `html[${DOCK_ROOT_ATTR}='1'] body {`,
        '  box-sizing: border-box !important;',
        '}',
      ].join('\n');
      (document.head || document.documentElement).appendChild(style);
    } catch (_e) {
      // ignore
    }
  }

  function readWidthPx(): number {
    try {
      const rect = panelEl.getBoundingClientRect?.();
      const width = Number(rect?.width || 0);
      if (Number.isFinite(width) && width > 0) return width;
    } catch (_e) {
      // ignore
    }
    try {
      const computed = getComputedStyle(panelEl);
      const width = Number.parseFloat(
        String(computed.width || '')
          .replace('px', '')
          .trim(),
      );
      if (Number.isFinite(width) && width > 0) return width;
    } catch (_e) {
      // ignore
    }
    return 420;
  }

  const clearDock = () => {
    const root = document.documentElement;
    if (!root) return;
    try {
      root.removeAttribute(DOCK_ROOT_ATTR);
      root.style.removeProperty(DOCK_WIDTH_CSS_VAR);
    } catch (_e) {
      // ignore
    }
  };

  const syncWidth = () => {
    if (disposed || !enabled || !open) return;
    try {
      const root = document.documentElement;
      if (!root) return;
      if (!shouldDockViewport()) {
        clearDock();
        return;
      }
      const width = Math.round(readWidthPx());
      root.setAttribute(DOCK_ROOT_ATTR, '1');
      root.style.setProperty(DOCK_WIDTH_CSS_VAR, `${width}px`, 'important');
    } catch (_e) {
      // ignore
    }
  };

  const onViewportResize = () => syncWidth();

  const cancelDockRaf = () => {
    if (dockRaf == null) return;
    try {
      cancelAnimationFrame(dockRaf);
    } catch (_e) {
      // ignore
    }
    dockRaf = null;
  };

  const removeResizeListener = () => {
    if (!listening) return;
    listening = false;
    try {
      globalThis.removeEventListener('resize', onViewportResize);
    } catch (_e) {
      // ignore
    }
  };

  const setOpen = (nextOpen: boolean) => {
    if (disposed || !enabled) return;
    open = nextOpen === true;
    cancelDockRaf();
    if (!open) {
      removeResizeListener();
      clearDock();
      return;
    }

    ensureDockStyle();
    syncWidth();
    if (!listening) {
      listening = true;
      try {
        globalThis.addEventListener('resize', onViewportResize, { passive: true });
      } catch (_e) {
        listening = false;
      }
    }
    try {
      dockRaf = requestAnimationFrame(() => {
        dockRaf = null;
        syncWidth();
      });
    } catch (_e) {
      dockRaf = null;
    }
  };

  const cleanup = () => {
    if (disposed) return;
    open = false;
    cancelDockRaf();
    removeResizeListener();
    clearDock();
    disposed = true;
  };

  return { readWidthPx, syncWidth, setOpen, cleanup };
}
