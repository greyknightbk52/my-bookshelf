import * as React from "react";
import * as reactQuery from "react-query";
import { ReactQueryDevtoolsPanel } from "react-query/devtools";
import { createRoot } from "react-dom/client";

let latestQueryClient = null;
let rerender = () => {};
window.__devtools = {
  setQueryClient(queryClient) {
    latestQueryClient = queryClient;
    setTimeout(rerender);
  },
};

function useLatestQueryClient() {
  rerender = React.useReducer(() => ({}))[1];
  return latestQueryClient;
}

function install() {
  function DevTools() {
    const queryClient = useLatestQueryClient();

    return (
      <>
        {queryClient ? (
          <reactQuery.QueryClientProvider client={queryClient}>
            <ReactQueryDevtoolsPanel />
          </reactQuery.QueryClientProvider>
        ) : (
          "No query client has been initialized"
        )}
      </>
    );
  }

  const devToolsRoot = document.createElement("div");
  document.body.appendChild(devToolsRoot);
  createRoot(devToolsRoot).render(<DevTools />);
}

export { install };
