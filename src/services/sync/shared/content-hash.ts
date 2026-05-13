function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let out = '';
  for (const b of bytes) out += b.toString(16).padStart(2, '0');
  return out;
}

export async function sha256Hex(input: string): Promise<string> {
  const text = String(input || '');
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const subtle = (globalThis as any)?.crypto?.subtle as SubtleCrypto | undefined;
  if (subtle && typeof subtle.digest === 'function') {
    const digest = await subtle.digest('SHA-256', data);
    return toHex(digest);
  }

  const nodeCrypto = await import('node:crypto');
  return nodeCrypto.createHash('sha256').update(Buffer.from(data)).digest('hex');
}

