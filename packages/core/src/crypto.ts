/*
Copyright 2023 The Sigstore Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import crypto, { BinaryLike } from 'crypto';
export type { KeyObject } from 'crypto';

const SHA256_ALGORITHM = 'sha256';

export function createPublicKey(
  keyValue: string | Uint8Array,
  type: 'spki' | 'pkcs1' = 'spki'
): crypto.KeyObject {
  if (typeof keyValue === 'string') {
    const key = keyValue;
    return crypto.createPublicKey(key);
  } else {
    const key = Buffer.from(keyValue);
    return crypto.createPublicKey({ key, format: 'der', type: type });
  }
}

export function digest(algorithm: string, ...data: BinaryLike[]): Uint8Array {
  const hash = crypto.createHash(algorithm);
  for (const d of data) {
    hash.update(d);
  }
  return hash.digest();
}

// TODO: deprecate this in favor of digest()
export function hash(...data: BinaryLike[]): Uint8Array {
  const hash = crypto.createHash(SHA256_ALGORITHM);
  for (const d of data) {
    hash.update(d);
  }
  return hash.digest();
}

export function verify(
  data: Uint8Array,
  key: crypto.KeyLike,
  signature: Uint8Array,
  algorithm?: string
): boolean {
  // The try/catch is to work around an issue in Node 14.x where verify throws
  // an error in some scenarios if the signature is invalid.
  try {
    return crypto.verify(algorithm, data, key, signature);
  } catch (e) {
    /* istanbul ignore next */
    return false;
  }
}

export function bufferEqual(a: Uint8Array, b: Uint8Array): boolean {
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    /* istanbul ignore next */
    return false;
  }
}
