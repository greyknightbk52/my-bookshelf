function loadDevTools(callback) {
  function go() {
    import("./dev-tools")
      .then((devTools) => devTools.install())
      .finally(callback);
  }

  return go();
}

export { loadDevTools };
