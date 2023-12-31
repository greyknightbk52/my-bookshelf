import {
  render as rtlRender,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import { AppProviders } from "context";
import { buildUser } from "test/generate";
import * as usersDB from "test/data/users";
import * as auth from "auth-provider";

async function render(ui, { route = "/list", user, ...renderOptions } = {}) {
  user = typeof user === "undefined" ? await loginAsUser() : user;
  window.history.pushState({}, "Test Page", route);

  const returnValue = {
    ...rtlRender(ui, {
      wrapper: AppProviders,
      ...renderOptions,
    }),
    user,
  };

  await waitForLoadingToFinish();
  return returnValue;
}

async function loginAsUser(userProperties) {
  const user = buildUser(userProperties);
  await usersDB.create(user);
  const authUser = await usersDB.authenticate(user);
  window.localStorage.setItem(auth.localStorageKey, authUser.token);
  return authUser;
}

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    { timeout: 60000 }
  );

export * from "@testing-library/react";
export { render, waitForLoadingToFinish, loginAsUser };
