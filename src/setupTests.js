import "@testing-library/jest-dom/extend-expect";
import { configure, act } from "@testing-library/react";
import { server } from "test/server";
import * as auth from "auth-provider";
import * as usersDB from "test/data/users";
import * as booksDB from "test/data/books";
import * as listItemsDB from "test/data/list-items";

window.history.pushState({}, "Home Page", "/list");

configure({ defaultHidden: true });
process.env.DEBUG_PRINT_LIMIT = 15000;

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(async () => {
  await Promise.all([
    auth.logout(),
    usersDB.reset(),
    booksDB.reset(),
    listItemsDB.reset(),
  ]);
});

afterEach(async () => {
  if (jest.isMockFunction(setTimeout)) {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  }
});
