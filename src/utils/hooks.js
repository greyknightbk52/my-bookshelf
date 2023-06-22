import * as React from "react";

function useSafeDispatch(dispatch) {
  const mounted = React.useRef(false);
  React.useLayoutEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  return React.useCallback(
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch]
  );
}

const defaultInitialState = { status: "idle", error: null, data: null };
function useAsync(initialState) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  });

  const [{ data, error, status }, setState] = React.useReducer(
    (s, a) => ({ ...s, ...a }),
    initialStateRef.current
  );

  const safeSetState = useSafeDispatch(setState);

  const setData = React.useCallback(
    (data) => safeSetState({ data, status: "resolved" }),
    [safeSetState]
  );

  const setError = React.useCallback(
    (error) => safeSetState({ error, status: "rejected" }),
    [safeSetState]
  );

  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  );

  const run = React.useCallback(
    (promise) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`
        );
      }
      safeSetState({ status: "pending" });
      return promise
        .then((data) => {
          setData(data);
          return data;
        })
        .catch((error) => {
          setError(error);
          return Promise.reject(error);
        });
    },
    [safeSetState, setData, setError]
  );

  return {
    data,
    error,
    status,
    isLoading: status === "pending",
    isIdle: status === "idle",
    isSuccess: status === "resolved",
    isError: status === "rejected",
    setData,
    setError,
    reset,
    run,
  };
}

export { useAsync };
