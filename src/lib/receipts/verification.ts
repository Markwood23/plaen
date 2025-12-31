import { createHash } from 'crypto';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

function sortObjectKeysDeep(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeysDeep);
  }

  if (value && typeof value === 'object') {
    const obj = value as Record<string, JsonValue>;
    const sortedKeys = Object.keys(obj).sort();
    const result: Record<string, JsonValue> = {};
    for (const key of sortedKeys) {
      result[key] = sortObjectKeysDeep(obj[key]);
    }
    return result;
  }

  return value;
}

export function stableStringifyJson(value: unknown): string {
  // We only guarantee determinism for JSON-ish values.
  const jsonValue = value as JsonValue;
  const normalized = sortObjectKeysDeep(jsonValue);
  return JSON.stringify(normalized);
}

export function sha256Hex(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export function computeReceiptVerificationHash(snapshotData: unknown): {
  hash: string;
  tail: string;
  canonical: string;
} {
  const canonical = stableStringifyJson(snapshotData);
  const hash = sha256Hex(canonical);
  const tail = hash.slice(-10);
  return { hash, tail, canonical };
}
