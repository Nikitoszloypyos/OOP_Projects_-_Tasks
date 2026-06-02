import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

import type { PasswordHasher } from '../../application/ports';

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

export class ScryptPasswordHasher implements PasswordHasher {
      async hash(password: string): Promise<string> {
            const salt = randomBytes(16).toString('hex');
            const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

            return `${salt}:${derivedKey.toString('hex')}`;
      }

      async verify(password: string, hash: string): Promise<boolean> {
            const [salt, key] = hash.split(':');

            if (!salt || !key) {
                  return false;
            }

            const storedKey = Buffer.from(key, 'hex');
            const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

            if (storedKey.length !== derivedKey.length) {
                  return false;
            }

            return timingSafeEqual(storedKey, derivedKey);
      }
}
