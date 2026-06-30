import { assertCollectorDef, type CollectorDefinition } from '@collectors/collector-contract.ts';

export type CollectorLocation = {
  href?: string;
  hostname?: string;
  pathname?: string;
};

export type CollectorRegistryLike = {
  pickActive?: (locationArg?: CollectorLocation) => { id: string; collector: any } | null;
  list?: () => Array<{
    id: string;
    collector?: any;
    matches?: (loc: CollectorLocation) => boolean;
    inpageMatches?: (loc: CollectorLocation) => boolean;
  }>;
};

function currentLocation(): CollectorLocation | null {
  if (typeof location === 'undefined') return null;
  return {
    href: location.href,
    hostname: location.hostname,
    pathname: location.pathname,
  };
}

export function resolveActiveOrInpageCollector(
  registry: CollectorRegistryLike | null | undefined,
  locationArg?: CollectorLocation,
) {
  const active = resolveActiveCollector(registry, locationArg);
  if (active) return active;

  const locationValue = locationArg || currentLocation();
  if (!locationValue) return null;

  const list = registry?.list?.() || [];
  for (const item of list) {
    const matcher = typeof item.inpageMatches === 'function' ? item.inpageMatches : item.matches;
    if (typeof matcher !== 'function') continue;
    try {
      if (matcher(locationValue)) return { id: item.id, ...(item.collector || {}) };
    } catch (_error) {
      // ignore matcher errors
    }
  }

  return null;
}

export function resolveActiveCollector(
  registry: CollectorRegistryLike | null | undefined,
  locationArg?: CollectorLocation,
) {
  const picked = locationArg ? registry?.pickActive?.(locationArg) : registry?.pickActive?.();
  if (!picked?.collector) return null;
  return { id: picked.id, ...picked.collector };
}

export function createCollectorsRegistry() {
  const definitions: CollectorDefinition[] = [];

  function register(definition: CollectorDefinition): boolean {
    const checked = assertCollectorDef(definition);
    if (definitions.some((item) => item.id === checked.id)) return false;
    definitions.push(checked);
    return true;
  }

  function pickActive(locationArg?: CollectorLocation): CollectorDefinition | null {
    const locationValue = locationArg || {
      href: location.href,
      hostname: location.hostname,
      pathname: location.pathname,
    };
    for (const definition of definitions) {
      try {
        if (definition.matches(locationValue)) return definition;
      } catch (_e) {
        // ignore and keep trying others
      }
    }
    return null;
  }

  function list() {
    return definitions.slice();
  }

  return { register, pickActive, list };
}

export type CollectorsRegistry = ReturnType<typeof createCollectorsRegistry>;
