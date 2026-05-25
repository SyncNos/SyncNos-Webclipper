export type AlarmCreateInfo = {
  when?: number;
  delayInMinutes?: number;
};

export type Alarm = {
  name: string;
  scheduledTime?: number;
};

function getAlarmsApi(): any | null {
  const anyGlobal = globalThis as any;
  return anyGlobal.browser?.alarms ?? anyGlobal.chrome?.alarms ?? null;
}

export function isAlarmsAvailable(): boolean {
  const api = getAlarmsApi();
  return !!api?.create && !!api?.onAlarm?.addListener;
}

export function create(name: string, info: AlarmCreateInfo): boolean {
  const api = getAlarmsApi();
  if (!api?.create) return false;
  try {
    api.create(name, info);
    return true;
  } catch (_e) {
    return false;
  }
}

export async function clear(name: string): Promise<boolean> {
  const api = getAlarmsApi();
  if (!api?.clear) return false;

  try {
    const result = api.clear(name);
    if (result && typeof result.then === 'function') {
      return !!(await result);
    }
  } catch (_e) {
    // ignore and fallback to callback style
  }

  return await new Promise<boolean>((resolve) => {
    try {
      api.clear(name, (wasCleared: boolean) => resolve(!!wasCleared));
    } catch (_e) {
      resolve(false);
    }
  });
}

export function onAlarm(listener: (alarm: Alarm) => void): () => void {
  const api = getAlarmsApi();
  if (!api?.onAlarm?.addListener || !api?.onAlarm?.removeListener) return () => {};
  try {
    api.onAlarm.addListener(listener);
  } catch (_e) {
    return () => {};
  }
  return () => {
    try {
      api.onAlarm.removeListener(listener);
    } catch (_e) {
      // ignore
    }
  };
}
