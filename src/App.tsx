import { usePersistedState } from '../lib/usePersistedState';

import { Loader } from './Loader';

export function App() {
  const [isLoading, setIsLoading, removeLoadingState] = usePersistedState(
    'loading',
    false,
  );

  return (
    <div className="bg-zinc-950 text-white grid place-items-center h-full">
      <div className="w-[150px] space-y-3">
        <div className="flex items-center gap-2">
          <p>Loading:</p>

          <span
            data-loading={isLoading}
            className="font-medium text-lg data-[loading=true]:text-sky-400 data-[loading=false]:text-amber-400 flex items-center"
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
            className="w-full bg-teal-900 data-[loading=true]:bg-red-900 font-medium rounded-md px-4 py-1.5 hover:bg-teal-800 data-[loading=true]:hover:bg-red-800 transition-colors"
            onClick={() => setIsLoading((state) => !state)}
          >
            {isLoading ? 'Stop' : 'Start'}
          </button>

          <button
            type="button"
            className="w-full bg-amber-900 font-medium rounded-md px-4 py-1.5 hover:bg-amber-800 transition-colors"
            onClick={removeLoadingState}
          >
            Remove Persisted
          </button>
        </div>
      </div>
    </div>
  );
}
