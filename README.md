# `react-persisted-state`

Easily persist your states across sessions with minimal effort. `react-persisted-state` extends the familiar `useState` hook to allow state persistence in `localStorage`, `sessionStorage`, `cookies`, or **even through custom adapters**. This library is designed to be fully flexible, allowing you to maintain state persistence with identical usability to React's own state hook, including inferred typing, state setting functions, initial state definitions, and more.

## Features

- **Seamless State Persistence**: Automatically persists state across page reloads and sessions.
- **Plug-and-Play**: Uses `localStorage` by default but easily switches to `sessionStorage`, `cookies` or other custom adapters.
- **Custom Storage Adapters**: Extend persistence to any storage by implementing `IPersistedAdapter`.
- **Fully Typed**: TypeScript support out-of-the-box, with inferred types for your state.
- **Minimal API**: Designed to be a drop-in replacement for React's `useState`.

## Installation

Using npm
```bash
npm install react-persisted-state
```

Using yarn
```bash
yarn add react-persisted-state
```

Using pnpm
```bash
pnpm add react-persisted-state
```

## Usage Examples

Here are various ways to use `react-persisted-state`, demonstrating its flexibility:

### Basic Usage with `localStorage` (Default)

```ts
import { usePersistedState } from 'react-persisted-state';

const [count, setCount] = usePersistedState('countKey', 0);
```

### Using `sessionStorage`

```ts
import { usePersistedState } from 'react-persisted-state';

const [userSession] = usePersistedState<string | null>('userSessionKey', null, 'sessionStorage');

/**
 * Or you can use directly `window.sessionStorage`
 */
const [userSession] = usePersistedState<string | null>('userSessionKey', null, window.sessionStorage);
```

### Using `cookies`

```ts
import { usePersistedState, CookiePersistedAdapter } from 'react-persisted-state';

const [theme, setTheme] = usePersistedState<Theme>('theme', 'light', 'cookies');

/**
 * Or you can a direct instance of CookiePersistedAdapter
 */
const [theme, setTheme] = usePersistedState<Theme>('theme', 'light', new CookiePersistedAdapter());
```

### Using a Custom Persisted Adapter

```ts
// Create your implementation
import { usePersistedState, IPersistedAdapter } from 'react-persisted-state';

class CustomPersistedAdapter implements IPersistedAdapter {
  getItem(key: string): string {
    // fetch your data and return in JSON format
  }

  setItem(key: string, value: string): void {
    // store your data in JSON format
  }

  removeItem(key: string): void {
    // remove your data
  }
}

// And use it
const [state, setState] = usePersistedState('stateKey', null, new CustomPersistedAdapter());

```

### Removing Persisted State

```ts
import { usePersistedState } from 'react-persisted-state';

const [theme, setTheme, removePersistedTheme] = usePersistedState<Theme>('theme', 'light');

/**
 * This will remove the persisted theme from localStorage
 */
removePersistedTheme();
```

## Customizing Storage Behavior

Implement `IPersistedAdapter` to customize storage methods, allowing you to use any storage mechanism your prefer. The adapter requires three methods: `getItem`, `setItem` and `removeItem`. Look at the `CustomPersistedAdapter` above example to see how to implement it.

## Contributing

Contributions are welcome! Whether it's feature requests, bug reports, or pull requests, feel free to contribute. For more details, check out [CONTRIBUTING.md](https://github.com/felipstein/classify-react/blob/master/CONTRIBUTING.md).
