import packageJson from "../../../package.json";
import { setupWorker } from "msw";
import { handlers } from "./server-handlers";

const fullUrl = new URL(packageJson.homepage);
const server = setupWorker(...handlers);
server.start({
  quiet: true,
  serviceWorker: {
    url: fullUrl.pathname + "mockServiceWorker.js",
  },
});

export * from "msw";
export { server };
