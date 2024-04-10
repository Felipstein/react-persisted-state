import { useCallback, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { CookiePersistedAdapter } from './interfaces/adapters/CookiePersistedAdapter';
import type { IPersistedAdapter } from './interfaces/IPersistedAdapter';

type RemovePersistedStateAction<S> = () => S | undefined;

export function usePersistedState<S>(
  key: string,
  initialState: S | (() => S),
  persistedAdapter?: IPersistedAdapter | PersistedAdapterType,
): [S, Dispatch<SetStateAction<S>>, RemovePersistedStateAction<S>];

export function usePersistedState<S = undefined>(
  key: string,
  initialState?: (S | undefined) | (() => S | undefined),
  persistedAdapter?: IPersistedAdapter | PersistedAdapterType,
): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>,
  RemovePersistedStateAction<S>,
];

export function usePersistedState<S = undefined>(
  key: string,
  initialState?: S | (() => S),
  persistedAdapter_:
    | IPersistedAdapter
    | PersistedAdapterType = window.localStorage,
) {
  const persistedAdapter = useMemo(
    () => getPersistedAdapter(persistedAdapter_),
    [persistedAdapter_],
  );

  const coreStateReturn = useState<S>(() => {
    const rawPersistedValue = persistedAdapter.getItem(key);

    if (rawPersistedValue) {
      try {
        return JSON.parse(rawPersistedValue);
      } catch {
        persistedAdapter.removeItem(key);
      }
    }

    const realInitialState =
      typeof initialState === 'function'
        ? (initialState as () => S)()
        : initialState;

    if (realInitialState !== undefined) {
      persistedAdapter.setItem(key, JSON.stringify(realInitialState));
    }

    return realInitialState;
  });

  const core = {
    state: coreStateReturn[0],
    setState: coreStateReturn[1],
  };

  const setState = useCallback<typeof core.setState>(
    (newState) => {
      core.setState(newState);

      const newStatePersisted =
        typeof newState === 'function'
          ? (newState as (prevState: S) => S)(core.state)
          : newState;

      if (newStatePersisted === undefined) {
        persistedAdapter.removeItem(key);
      } else {
        persistedAdapter.setItem(key, JSON.stringify(newStatePersisted));
      }
    },
    [core.state],
  );

  const removePersistedState = useCallback<
    RemovePersistedStateAction<S>
  >(() => {
    const rawPersistedValue = persistedAdapter.getItem(key);

    persistedAdapter.removeItem(key);

    if (!rawPersistedValue) {
      return;
    }

    try {
      return JSON.parse(rawPersistedValue) as S;
    } catch {}
  }, []);

  return [core.state, setState, removePersistedState] as const;
}

type PersistedAdapterType = 'localStorage' | 'sessionStorage' | 'cookies';

const persistedAdapterTypesMap: Record<
  PersistedAdapterType,
  IPersistedAdapter
> = {
  localStorage: window.localStorage,
  sessionStorage: window.sessionStorage,
  cookies: new CookiePersistedAdapter(),
};

function getPersistedAdapter(
  persistedAdapter: IPersistedAdapter | PersistedAdapterType,
) {
  return typeof persistedAdapter === 'string'
    ? persistedAdapterTypesMap[persistedAdapter]
    : persistedAdapter;
}
