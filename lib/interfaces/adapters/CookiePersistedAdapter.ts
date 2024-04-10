import Cookies from 'js-cookie';

import type { IPersistedAdapter } from '../IPersistedAdapter';

export class CookiePersistedAdapter implements IPersistedAdapter {
  getItem(key: string): string | null {
    return Cookies.get(key) || null;
  }

  setItem(key: string, value: string): void {
    Cookies.set(key, value);
  }

  removeItem(key: string): void {
    Cookies.remove(key);
  }
}
