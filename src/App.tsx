import { usePersistedState } from '../lib/usePersistedState';

import { Loader } from './Loader';

export function App() {
  const [isLoading, setIsLoading, removeLoadingState] = usePersistedState(
    'loading',
    false,
  );

  return (
    <div className="grid h-full place-items-center bg-zinc-950 text-white">
      <div className="w-[150px] space-y-3">
        <div className="flex items-center gap-2">
          <p>Loading:</p>

          <span
            data-loading={isLoading}
            className="flex items-center text-lg font-medium data-[loading=false]:text-amber-400 data-[loading=true]:text-sky-400"
          >
            {isLoading ? 'true' : 'false'}

            {isLoading ? (
              <Loader className="ml-2 size-5" />
            ) : (
              <Loader className="ml-2 size-5 animate-none" />
            )}
          </span>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            data-loading={isLoading}
            className="w-full rounded-md bg-teal-900 px-4 py-1.5 font-medium transition-colors hover:bg-teal-800 data-[loading=true]:bg-red-900 data-[loading=true]:hover:bg-red-800"
            onClick={() => setIsLoading((state) => !state)}
          >
            {isLoading ? 'Stop' : 'Start'}
          </button>

          <button
            type="button"
            className="w-full rounded-md bg-amber-900 px-4 py-1.5 font-medium transition-colors hover:bg-amber-800"
            onClick={removeLoadingState}
          >
            Remove Persisted
          </button>
        </div>
      </div>
    </div>
  );
}
