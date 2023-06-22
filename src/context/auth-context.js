import * as React from "react";
import { FullPageSpinner, FullPageErrorFallback } from "components/lib";
import * as auth from "auth-provider";
import { useAsync } from "utils/hooks";
import { client } from "utils/api-client";
import { useQueryClient } from "react-query";
import { setQueryDataForBook } from "utils/books";

const AuthContext = React.createContext();
AuthContext.displayName = "AuthContext";

function AuthProvider(props) {
  const queryClient = useQueryClient();
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync();

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData(queryClient);
    run(appDataPromise);
  }, [run, queryClient]);

  const login = React.useCallback(
    (form) => auth.login(form).then((user) => setData(user)),
    [setData]
  );

  const register = React.useCallback(
    (form) => auth.register(form).then((user) => setData(user)),
    [setData]
  );

  const logout = React.useCallback(() => {
    auth.logout();
    queryClient.clear();
    setData(null);
  }, [setData, queryClient]);

  const value = React.useMemo(
    () => ({ user, login, register, logout }),
    [login, logout, register, user]
  );

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />;
  }

  throw new Error(`Unhandled status: ${status}`);
}

async function bootstrapAppData(queryClient) {
  let user = null;
  const token = await auth.getToken();

  if (token) {
    const data = await client("bootstrap", { token });
    queryClient.setQueryData("list-items", data.listItems, {
      staleTime: 5000,
    });
    for (const listItem of data.listItems) {
      setQueryDataForBook(queryClient, listItem.book);
    }
    user = data.user;
  }
  return user;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

function useClient() {
  const { user } = useAuth();
  const token = user?.token;
  return React.useCallback(
    (endpoint, config) => client(endpoint, { ...config, token }),
    [token]
  );
}

export { AuthProvider, useAuth, useClient };
