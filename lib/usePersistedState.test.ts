import { act, renderHook } from '@testing-library/react-hooks';

import { IPersistedAdapter } from './interfaces/IPersistedAdapter';
import { usePersistedState } from './usePersistedState';

describe('usePersistedState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should persist state in localStorage', () => {
    const key = 'testKey';
    const initialValue = 'testValue';
    const nextValue = 'newValue';

    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn(() => initialValue);
    Storage.prototype.removeItem = jest.fn();

    const { result } = renderHook(() => usePersistedState(key, initialValue));

    const [persistedState, setPersistedState] = result.current;

    expect(persistedState).toBe(initialValue);

    act(() => {
      setPersistedState(nextValue);
    });

    expect(result.current[0]).toBe(nextValue);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(nextValue),
    );
  });

  it('should remove persisted state from localStorage', () => {
    const key = 'testKey';
    const initialValue = 'testValue';

    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn(() => initialValue);
    Storage.prototype.removeItem = jest.fn();

    const { result } = renderHook(() => usePersistedState(key, initialValue));

    const [, , removePersistedState] = result.current;

    act(() => {
      removePersistedState();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  it('should persist and recover the state correctly', () => {
    const key = 'testPersistenceKey';
    const initialValue = 'test';

    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();

    renderHook(() => usePersistedState(key, initialValue));

    Storage.prototype.getItem = jest.fn(() => JSON.stringify(initialValue));

    const { result: resultAfterReload } = renderHook(() =>
      usePersistedState(key, initialValue),
    );

    const [persistedState] = resultAfterReload.current;

    expect(persistedState).toBe(initialValue);
  });

  it('should update the state and persists it', () => {
    const key = 'testUpdateKey';
    const initialValue = 'initial';
    const newValue = 'updated';

    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn(() => JSON.stringify(initialValue));

    const { result } = renderHook(() => usePersistedState(key, initialValue));

    const [, setPersistedState] = result.current;

    act(() => {
      setPersistedState(newValue);
    });

    expect(result.current[0]).toBe(newValue);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(newValue),
    );
  });

  it('should works correctly with custom persistence adapters', () => {
    const key = 'customAdapterKey';
    const initialValue = 'value';

    const customAdapter: IPersistedAdapter = {
      setItem: jest.fn(),
      getItem: jest.fn(() => null),
      removeItem: jest.fn(),
    };

    const { result } = renderHook(() =>
      usePersistedState(key, initialValue, customAdapter),
    );

    const [persistedState, setPersistedState] = result.current;

    expect(persistedState).toBe(initialValue);
    expect(customAdapter.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(initialValue),
    );

    act(() => {
      setPersistedState('newValue');
    });

    expect(customAdapter.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify('newValue'),
    );
  });

  it('gracefully handles invalid persisted state values', () => {
    const key = 'invalidValueKey';
    const initialValue = 'initialValue';

    Storage.prototype.getItem = jest.fn(() => '{invalidJSON');
    Storage.prototype.removeItem = jest.fn();

    const { result } = renderHook(() => usePersistedState(key, initialValue));

    const [persistedState] = result.current;

    expect(persistedState).toBe(initialValue);
    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });
});

describe('usePersistedState with various initial values', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['a string', 'hello world'],
    ['a number', 42],
    ['an object', { hello: 'world' }],
    ['an array', [1, 2, 3]],
  ])('correctly handles %s as an initial value', (_, initialValue) => {
    const key = 'testInitialValuesKey';

    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn(() => null);

    const { result } = renderHook(() => usePersistedState(key, initialValue));

    const [persistedState] = result.current;

    expect(persistedState).toEqual(initialValue);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(initialValue),
    );
  });
});

describe('usePersistedState with storage type settings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['localStorage', window.localStorage],
    ['sessionStorage', window.sessionStorage],
  ])('uses %s when passed as persistedAdapter type', (type, storage) => {
    const key = `${type}Key`;
    const initialValue = 'initialValue';

    jest.spyOn(storage, 'getItem').mockReturnValueOnce(null);
    jest.spyOn(storage, 'setItem');
    jest.spyOn(storage, 'removeItem');

    const { result } = renderHook(() =>
      usePersistedState(
        key,
        initialValue,
        type as 'localStorage' | 'sessionStorage',
      ),
    );

    const [, setPersistedState, removePersistedState] = result.current;

    const newValue = 'newValue';

    act(() => {
      setPersistedState(newValue);
    });

    expect(storage.setItem).toHaveBeenCalledWith(key, JSON.stringify(newValue));

    act(() => {
      removePersistedState();
    });

    expect(storage.removeItem).toHaveBeenCalledWith(key);
  });
});
