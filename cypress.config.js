const { defineConfig } = require("cypress");
const isCi = require('is-ci')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const isDev = config.watchForFileChanges;
      if (!isCi) {
        config.baseUrl = isDev ? "http://localhost:3000" : "http://localhost:8811";
      }
      return config;
    },
  },
});
