import { useAsync } from "../hooks";
import { renderHook, act } from "@testing-library/react";

beforeEach(() => {
  jest.spyOn(console, "error");
});

afterEach(() => {
  console.error.mockRestore();
});

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

const defaultState = {
  status: "idle",
  data: null,
  error: null,
  isIdle: true,
  isLoading: false,
  isSuccess: false,
  isError: false,
  run: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
  reset: expect.any(Function),
};

const pendingState = {
  ...defaultState,
  isIdle: false,
  isLoading: true,
  status: "pending",
};

const resolvedState = {
  ...defaultState,
  isIdle: false,
  isSuccess: true,
  status: "resolved",
};

const rejectedState = {
  ...defaultState,
  status: "rejected",
  isIdle: false,
  isError: true,
};

test("calling run with a promise which resolves", async () => {
  const { promise, resolve } = deferred();
  const { result } = renderHook(() => useAsync());
  expect(result.current).toEqual(defaultState);
  let p;
  act(() => {
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(pendingState);
  const resolvedValue = Symbol("resolved value");
  await act(async () => {
    resolve(resolvedValue);
    await p;
  });
  expect(result.current).toEqual({
    ...resolvedState,
    data: resolvedValue,
  });
  act(() => {
    result.current.reset();
  });

  expect(result.current).toEqual(defaultState);
});

test("calling run with a promise which rejects", async () => {
  const { promise, reject } = deferred();
  const { result } = renderHook(() => useAsync());
  expect(result.current).toEqual(defaultState);
  let p;
  act(() => {
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(pendingState);
  const rejectedValue = Symbol("rejected value");
  await act(async () => {
    reject(rejectedValue);
    await p.catch(() => {});
  });
  expect(result.current).toEqual({ ...rejectedState, error: rejectedValue });
});

test("can specify a initial state", () => {
  const mockValue = Symbol("mock value");
  const customInitialState = {
    status: "resolved",
    data: mockValue,
  };
  const { result } = renderHook(() => useAsync(customInitialState));
  expect(result.current).toEqual({
    ...resolvedState,
    ...customInitialState,
  });
});

test("can set the data", () => {
  const mockData = Symbol("mock value");
  const { result } = renderHook(() => useAsync());
  act(() => {
    result.current.setData(mockData);
  });
  expect(result.current).toEqual({
    ...resolvedState,
    data: mockData,
  });
});

test("can set the error", () => {
  const mockError = Symbol("rejected value");
  const { result } = renderHook(() => useAsync());
  act(() => {
    result.current.setError(mockError);
  });
  expect(result.current).toEqual({
    ...rejectedState,
    error: mockError,
  });
});

test("No state updates happen if the component is unmounted while pending", async () => {
  const { promise, resolve } = deferred();
  const { result, unmount } = renderHook(() => useAsync());
  let p;
  act(() => {
    p = result.current.run(promise);
  });
  unmount();
  await act(async () => {
    resolve();
    await p;
  });
  expect(result.current).toEqual(pendingState);
  expect(console.error).not.toHaveBeenCalled();
});

test('Calling "run" without a promise results in an early error', () => {
  const { result } = renderHook(() => useAsync());
  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`
  );
});
