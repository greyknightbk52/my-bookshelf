import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./bootstrap";
// TODO
// import {Profiler} from 'components/profiler'
import { AppProviders } from "./context";
import { loadDevTools } from "dev-tools/load";

loadDevTools(() => {
  createRoot(document.getElementById("root")).render(
    <AppProviders>
      <App />
    </AppProviders>
  );
});
